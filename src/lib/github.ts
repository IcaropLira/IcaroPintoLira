import { useEffect, useState } from 'react';
import { GITHUB_USER } from '../data/profile';
import type { RepoStats } from '../types';

interface ApiRepo { name: string; stargazers_count: number; language: string | null }
let cache: Promise<Record<string, RepoStats>> | undefined;

function fetchRepos(): Promise<Record<string, RepoStats>> {
  cache ??= fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`)
    .then((r) => (r.ok ? (r.json() as Promise<ApiRepo[]>) : Promise.reject(new Error(String(r.status)))))
    .then((list) => Object.fromEntries(list.map((r) => [r.name, { stars: r.stargazers_count, language: r.language }])))
    .catch(() => ({}));
  return cache;
}

export function useRepoStats(): Record<string, RepoStats> {
  const [stats, setStats] = useState<Record<string, RepoStats>>({});
  useEffect(() => { void fetchRepos().then(setStats); }, []);
  return stats;
}
