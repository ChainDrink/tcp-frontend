import { ChainProperties } from '@/types/chains';
import { ApiPromise } from '@polkadot/api';
import { TypeRegistry } from '@polkadot/types/create';

const registry = new TypeRegistry();

export async function getChainProperties(
  api: ApiPromise
): Promise<ChainProperties> {
  const [
    chainProperties,
    systemName,
    systemVersion,
    systemChain,
    systemChainType,
  ] = await Promise.all([
    api.rpc.system.properties(),
    api.rpc.system.name(),
    api.rpc.system.version(),
    (await api.rpc.system.chain()).toString(),
    api.rpc.system.chainType
      ? api.rpc.system.chainType()
      : Promise.resolve(registry.createType('ChainType', 'Live')),
    api.rpc.system,
  ]);

  const result = {
    genesisHash: api.genesisHash.toHex(),
    systemName: systemName.toString(),
    systemVersion: systemVersion.toString(),
    systemChainType,
    systemChain,
    tokenDecimals: chainProperties.tokenDecimals.isSome
      ? chainProperties.tokenDecimals.unwrap().toArray()[0].toNumber()
      : 9,
    tokenSymbol: chainProperties.tokenSymbol.isSome
      ? chainProperties.tokenSymbol
        .unwrap()
        .toArray()
        .map((s) => s.toString())[0]
      : 'Unit',
  };

  return result as ChainProperties;
}
