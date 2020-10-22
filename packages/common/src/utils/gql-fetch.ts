import { ASTNode, print } from 'graphql';

interface GqlFetchArgs<V> {
  url: string;
  query: ASTNode;
  variables?: V;
  headers?: Record<string, string>;
}

export async function gqlFetch<V>({
  url,
  query,
  variables,
  headers,
}: GqlFetchArgs<V>): Promise<Response> {
  return await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({ query: print(query), variables }),
  });
}
