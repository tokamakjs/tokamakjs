import { RouteBranch } from '../types';

const DYNAMIC_SEGMENT_VALUE = 2;
const EMPTY_SEGMENT_VALUE = 1;
const STATIC_SEGMENT_VALUE = 10;
const CATCH_ALL_PENALTY = 2;

function _compareIndexes(a: Array<number>, b: Array<number>): number {
  const areSiblings = a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);
  return areSiblings ? a[a.length - 1] - b[b.length - 1] : 0;
}

function _computeScore(path: string): number {
  const segments = path.split('/');
  let { length: initialScore } = segments;

  if (segments.some((s) => s === '*')) {
    initialScore -= CATCH_ALL_PENALTY; // we penalize catch all routes
  }

  return segments
    .filter((s) => s !== '*')
    .reduce((memo, segment) => {
      if (segment.match(/^:\w+$/) != null) {
        // url with params /url/:param
        return memo + DYNAMIC_SEGMENT_VALUE;
      } else {
        return memo + segment === '' ? EMPTY_SEGMENT_VALUE : STATIC_SEGMENT_VALUE;
      }
    }, initialScore);
}

export function rankRouteBranches(branches: Array<RouteBranch>): Array<RouteBranch> {
  const pathScores = branches.reduce((memo, [path]) => {
    memo[path] = _computeScore(path);
    return memo;
  }, {} as Record<string, number>);

  return branches.slice().sort((a, b) => {
    const [aPath, , aIndexes] = a;
    const aScore = pathScores[aPath];

    const [bPath, , bIndexes] = b;
    const bScore = pathScores[bPath];

    return aScore !== bScore ? bScore - aScore : _compareIndexes(aIndexes, bIndexes);
  });
}
