import { Compiler, Entry } from 'webpack';

function _isEntry(entry: any): entry is Entry {
  return entry != null && typeof entry !== 'string' && !Array.isArray(entry);
}

export class RemoveReactRefreshOverlayWebpackPlugin {
  apply(compiler: Compiler) {
    if (Array.isArray(compiler.options.entry)) {
      compiler.options.entry = compiler.options.entry?.filter(
        (e) => !e.includes('ErrorOverlayEntry'),
      );
    } else if (_isEntry(compiler.options.entry)) {
      const { entry } = compiler.options;
      compiler.options.entry = Object.keys(entry).reduce((memo, key) => {
        const value = entry[key];
        memo[key] = Array.isArray(value)
          ? value.filter((e) => !e.includes('ErrorOverlayEntry'))
          : value;
        return memo;
      }, {} as Entry);
    }
  }
}
