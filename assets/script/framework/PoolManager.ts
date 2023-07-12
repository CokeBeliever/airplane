import { _decorator, instantiate, Node, NodePool, Prefab } from "cc";
const { ccclass, property } = _decorator;

interface IDictPool {
  [name: string]: NodePool;
}

interface IDictPrefab {
  [name: string]: Prefab;
}

@ccclass("PoolManager")
export class PoolManager {
  private _dictPool: IDictPool = {};
  private _dictPrefab: IDictPrefab = {};
  private static _instance: PoolManager = null;

  public static instance() {
    if (!this._instance) {
      this._instance = new PoolManager();
    }

    return this._instance;
  }

  public getNode(prefab: Prefab, parent: Node) {
    let name = prefab.name;
    let node: Node = null;
    this._dictPrefab[name] = prefab;
    let pool = this._dictPool[name];

    if (!pool) {
      pool = this._dictPool[name] = new NodePool();
    }

    if (pool.size() > 0) {
      node = pool.get();
    } else {
      node = instantiate(prefab);
    }

    node.parent = parent;
    node.active = true;
    return node;
  }

  public putNode(node: Node) {
    node.parent = null;
    let name = node.name;

    if (!this._dictPool[name]) {
      this._dictPool[name] = new NodePool();
    }

    this._dictPool[name].put(node);
  }
}
