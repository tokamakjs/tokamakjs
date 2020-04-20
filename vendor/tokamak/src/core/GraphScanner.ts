import { Reflector } from '../reflection';
import { Node, Type } from '../types';

export class GraphScanner {
  public async scan(RootModule: Type): Promise<Array<Node>> {
    return await this.traverse(RootModule);
  }

  private async traverse(
    Node: Type,
    scope: Array<Type> = [],
    visited: Array<Type> = [],
  ): Promise<Array<Node>> {
    const { imports } = Reflector.getModuleMetadata(Node);

    visited.push(Node);

    const children: Array<Node> = [];
    for (const imported of imports) {
      if (!visited.includes(imported)) {
        children.push(...(await this.traverse(imported, [...scope, Node], visited)));
      }
    }

    return [{ metatype: Node, scope }, ...children];
  }
}
