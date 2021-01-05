import { Params, PathMatch, PathPattern } from '../types';

function _compilePath(path: string, caseSensitive: boolean, end: boolean): [RegExp, Array<string>] {
  const keys: Array<string> = [];
  let source =
    '^(' +
    path
      .replace(/^\/*/, '/') // Make sure it has a leading /
      .replace(/\/?\*?$/, '') // Ignore trailing / and /*, we'll handle it below
      .replace(/[\\.*+^$?{}|()[\]]/g, '\\$&') // Escape special regex chars
      .replace(/:(\w+)/g, (_: string, key: string) => {
        keys.push(key);
        return '([^\\/]+)';
      }) +
    ')';

  if (path.endsWith('*')) {
    if (path.endsWith('/*')) {
      source += '\\/?'; // Don't include the / in params['*']
    }
    keys.push('*');
    source += '(.*)';
  } else if (end) {
    source += '\\/?';
  }

  if (end) {
    source += '$';
  }

  const flags = caseSensitive ? undefined : 'i';
  const matcher = new RegExp(source, flags);

  return [matcher, keys];
}

export function matchPath(pattern: PathPattern, pathname: string): PathMatch | undefined {
  if (typeof pattern === 'string') {
    pattern = { path: pattern };
  }

  const { path, caseSensitive = false, end = true } = pattern;
  const [matcher, paramNames] = _compilePath(path, caseSensitive, end);
  const match = pathname.match(matcher);

  if (match == null) {
    return;
  }

  const [, matchedPathname, ...values] = match;
  const params = paramNames.reduce((memo, paramName, i) => {
    memo[paramName] = decodeURIComponent(values[i].replace(/\+/g, ' '));
    return memo;
  }, {} as Params);

  return { path, pathname: matchedPathname, params };
}
