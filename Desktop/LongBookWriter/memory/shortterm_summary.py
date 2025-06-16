from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
import operator
from langchain_core.messages import AnyMessage, HumanMessage, SystemMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.callbacks import CallbackManager
from langchain_core.callbacks.manager import CallbackManagerForToolRun
from langchain_core.callbacks.manager import AsyncCallbackManagerForToolRun

# Define state type
import os
import operator
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END
from langchain_core.messages import AnyMessage, HumanMessage, SystemMessage, AIMessage
from langchain_openai import ChatOpenAI
from langchain_core.documents import Document

# === Shared Types ===
class WriterState(TypedDict):
    messages: Annotated[list[AnyMessage], operator.add]
    summary: str
    longterm_memory: str
    rag_context: str
    next_scene: str

# === Mocks for RAG ===
class MockRetriever:
    def get_relevant_documents(self, query):
        return [Document(page_content="他背叛了你，是命运，也是试炼。")]

class MockRAGStore:
    def add_texts(self, texts):
        print("🔁 添加到RAG记忆:", texts)

# === LongBookWriter OOP Class ===
class LongBookWriter:
    def __init__(self, rules: str, longterm_path: str = "data/longterm_doc.md"):
        self.model = ChatOpenAI(model="gpt-4o", temperature=0.3)
        self.retriever = MockRetriever()
        self.rag_store = MockRAGStore()
        self.rules = SystemMessage(content=rules)
        self.longterm_path = longterm_path
        self.graph = self._build_graph()

    def _build_graph(self):
        builder = StateGraph(WriterState)
        builder.add_node("retrieve_prompt", self.retrieve_prompt)
        builder.add_node("load_longterm_memory", self.load_longterm_memory)
        builder.add_node("retrieve_rag_context", self.retrieve_rag_context)
        builder.add_node("use_shortterm_summary", self.use_shortterm_summary)
        builder.add_node("chain_of_thought", self.chain_of_thought_planner)
        builder.add_node("generate_next_scene", self.generate_next_scene)
        builder.add_node("update_memories", self.update_memories)

        builder.set_entry_point("retrieve_prompt")
        builder.add_edge("retrieve_prompt", "load_longterm_memory")
        builder.add_edge("load_longterm_memory", "retrieve_rag_context")
        builder.add_edge("retrieve_rag_context", "use_shortterm_summary")
        builder.add_edge("use_shortterm_summary", "chain_of_thought")
        builder.add_edge("chain_of_thought", "generate_next_scene")
        builder.add_edge("generate_next_scene", "update_memories")
        builder.add_edge("update_memories", END)
        return builder.compile()

    # === Graph Nodes ===
    def retrieve_prompt(self, state: WriterState):
        return {"messages": [self.rules] + state["messages"]}

    def load_longterm_memory(self, state: WriterState):
        with open(self.longterm_path, encoding="utf-8") as f:
            return {"longterm_memory": f.read()}

    def retrieve_rag_context(self, state: WriterState):
        query = state["messages"][-1].content
        docs = self.retriever.get_relevant_documents(query)
        return {"rag_context": "\n\n".join(d.page_content for d in docs)}

    def use_shortterm_summary(self, state: WriterState):
        return {"summary": state["summary"]}

    def chain_of_thought_planner(self, state: WriterState):
        prompt = f"""剧情摘要：{state['summary']}
人物设定：{state['longterm_memory']}
风格片段：{state['rag_context']}

请思考下一章的发展（事件、动机、情绪）。"""
        result = self.model.invoke([HumanMessage(content=prompt)])
        return {"messages": [result]}

    def generate_next_scene(self, state: WriterState):
        prompt = f"""你是一位网络小说作家，请继续写下一章节（约1000字）。
人物设定：{state['longterm_memory']}
摘要：{state['summary']}
风格片段：{state['rag_context']}
构思提示：{state['messages'][-1].content}

请直接输出正文，不要解释。"""
        result = self.model.invoke([HumanMessage(content=prompt)])
        return {"next_scene": result.content, "messages": [result]}

    def update_memories(self, state: WriterState):
        with open("data/generated_novel.txt", "a", encoding="utf-8") as f:
            f.write(state["next_scene"] + "\n\n")

        summary_prompt = f"请总结以下小说段落为三句话：\n{state['next_scene']}"
        summary = self.model.invoke([HumanMessage(content=summary_prompt)]).content
        self.rag_store.add_texts([state["next_scene"]])
        return {"summary": summary}

    # === Run Function ===
    def run(self, user_prompt: str, summary: str = ""):
        state = {
            "messages": [HumanMessage(content=user_prompt)],
            "summary": summary,
        }
        result = self.graph.invoke(state)
        print("\n📘 新章节生成:\n")
        print(result["next_scene"])
        return result["next_scene"]
rules_cn = """
请按以下规则生成小说：

1. 读取并使用长期记忆（人物设定、背景）；
2. 使用短期摘要帮助连贯剧情；
3. 使用风格片段模仿语言、节奏；
4. 思考后续发展（事件、情绪、冲突）；
5. 生成正文约1000字，直接写故事；
6. 如有新角色或重大剧情转折，请在末尾建议更新长期记忆。
"""

writer = LongBookWriter(rules=rules_cn)

writer.run(
    user_prompt="请继续写接下来的剧情，林烬刚刚踏入暮霞山的边界。",
    summary="林烬被沈焱背叛后，只身逃往暮霞山，途中疑云重重。"
)