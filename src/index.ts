import 'dotenv/config'
import { parseEther } from 'viem'
import { getOrCreateSmartAccount } from './accounts/smartAccount'
import { bundlerClient, getGasPrice } from './config/bundler'

const RECIPIENT = '0x4f3c0610e2ACf990fD382A5Fb11021CaECCAf1D7' as const

const main = async () => {
  const smartAccount = await getOrCreateSmartAccount()
  const gasPrice = await getGasPrice()

  const userOpHash = await bundlerClient.sendUserOperation({
    account: smartAccount,
    calls: [{
      to: RECIPIENT,
      value: parseEther('0.001'),
      data: '0x',
    }],
    ...gasPrice,
  })

  console.log('UserOp Hash:', userOpHash)

  const receipt = await bundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  })

  console.log('✅ User Operation confirmed!')
  console.log('Tx Hash:', receipt.receipt.transactionHash)
}

main().catch(console.error)
