import { NotImplementedException } from '../exceptions';
import { Type } from '../types';
import { Container } from './container';
import { ContainerScanner } from './container-scanner';

export class AppContext {
  private _scanner: ContainerScanner;
  private _isInitialized = false;

  private constructor(private readonly _container: Container) {
    this._scanner = new ContainerScanner(_container);
  }

  static async create(metatype: Type): Promise<AppContext> {
    const container = await Container.scan(metatype);
    const context = new AppContext(container);
    await context.init();
    return context;
  }

  get isInitialized() {
    return this._isInitialized;
  }

  private async init(): Promise<void> {
    if (this._isInitialized) return;

    await this.callOnInit();
    await this.callOnDidInit();

    this._isInitialized = true;
  }

  public get<T = any, R = T>(token: Type<T> | string | symbol): R {
    if (!this._isInitialized) {
      throw new Error('AppContext not initialized');
    }

    return this._scanner.find<T, R>(token);
  }

  public resolve<T = any, R = T>(_token: Type<T> | string | symbol): R {
    if (!this._isInitialized) {
      throw new Error('AppContext not initialized');
    }
    // TODO: What's the point of setting the Scope if we then need two APIs?
    // Then we can just use resolve to get a transient instance or use get to
    // get a transient instance based on the scope. Both seem redundant.
    throw new NotImplementedException('This functionality is still not available.');
  }

  private async callOnInit() {
    const { modules } = this._container;
    for (const module of modules.values()) {
      await module.callOnInit();
    }
  }

  private async callOnDidInit() {
    const { modules } = this._container;
    for (const module of modules.values()) {
      await module.callOnDidInit();
    }
  }
}
