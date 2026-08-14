import { useEffect, useState } from "react";

export type GithubStats = {
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
};

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: GithubStats };

const cache = new Map<string, GithubStats>();

/** Fetches public, unauthenticated GitHub profile stats client-side. Fails silently to an "error" state — callers should degrade gracefully rather than blocking the page. */
export function useGithubStats(username: string): State {
  const [state, setState] = useState<State>(() =>
    cache.has(username) ? { status: "ready", data: cache.get(username)! } : { status: "loading" }
  );

  useEffect(() => {
    if (cache.has(username)) return;
    let cancelled = false;

    fetch(`https://api.github.com/users/${username}`, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("GitHub API request failed");
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        const data: GithubStats = {
          publicRepos: json.public_repos ?? 0,
          followers: json.followers ?? 0,
          following: json.following ?? 0,
          createdAt: json.created_at ?? "",
        };
        cache.set(username, data);
        setState({ status: "ready", data });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  return state;
}
