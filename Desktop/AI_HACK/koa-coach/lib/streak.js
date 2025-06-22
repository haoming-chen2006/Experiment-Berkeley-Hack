import { supabase } from "./supabase";

export async function updateStreak() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const today = new Date().toISOString().slice(0, 10);
  let { data, error } = await supabase
    .from("streaks")
    .select("streak,last_login")
    .eq("user_id", user.id)
    .single();
  if (error && !error.message?.includes("No rows")) {
    console.error("Fetch streak error", error);
    return 0;
  }

  let newStreak = 1;
  if (data) {
    const last = data.last_login?.slice(0, 10);
    if (last === today) {
      newStreak = data.streak || 1;
    } else if (last && Math.floor((new Date(today) - new Date(last)) / 86400000) === 1) {
      newStreak = (data.streak || 0) + 1;
    }

    await supabase
      .from("streaks")
      .update({ streak: newStreak, last_login: today })
      .eq("user_id", user.id);
  } else {
    await supabase
      .from("streaks")
      .insert({ user_id: user.id, streak: newStreak, last_login: today });
  }
  return newStreak;
}

export async function fetchStreak() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;
  const { data } = await supabase
    .from("streaks")
    .select("streak")
    .eq("user_id", user.id)
    .single();
  return data?.streak || 0;
}
