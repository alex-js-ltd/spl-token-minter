/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/spl_token_minter.json`.
 */
export type SplTokenMinter = {
	address: 'GaPC2f7pRHLE8AUpvAYXKP9QrRwpAuW3thuJpEYvJERg'
	metadata: {
		name: 'splTokenMinter'
		version: '0.1.0'
		spec: '0.1.0'
		description: 'Created with Anchor'
	}
	instructions: [
		{
			name: 'createToken'
			discriminator: [84, 52, 204, 228, 24, 140, 234, 75]
			accounts: [
				{
					name: 'payer'
					writable: true
					signer: true
				},
				{
					name: 'mintAccount'
					writable: true
					signer: true
				},
				{
					name: 'metadataAccount'
					writable: true
					pda: {
						seeds: [
							{
								kind: 'const'
								value: [109, 101, 116, 97, 100, 97, 116, 97]
							},
							{
								kind: 'account'
								path: 'tokenMetadataProgram'
							},
							{
								kind: 'account'
								path: 'mintAccount'
							},
						]
						program: {
							kind: 'account'
							path: 'tokenMetadataProgram'
						}
					}
				},
				{
					name: 'tokenProgram'
					address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
				},
				{
					name: 'tokenMetadataProgram'
					address: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
				},
				{
					name: 'systemProgram'
					address: '11111111111111111111111111111111'
				},
				{
					name: 'rent'
					address: 'SysvarRent111111111111111111111111111111111'
				},
			]
			args: [
				{
					name: 'tokenDecimals'
					type: 'u8'
				},
				{
					name: 'tokenName'
					type: 'string'
				},
				{
					name: 'tokenSymbol'
					type: 'string'
				},
				{
					name: 'tokenUri'
					type: 'string'
				},
			]
		},
		{
			name: 'mintToken'
			discriminator: [172, 137, 183, 14, 207, 110, 234, 56]
			accounts: [
				{
					name: 'mintAuthority'
					writable: true
					signer: true
				},
				{
					name: 'recipient'
				},
				{
					name: 'mintAccount'
					writable: true
				},
				{
					name: 'associatedTokenAccount'
					writable: true
				},
				{
					name: 'tokenProgram'
					address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
				},
				{
					name: 'associatedTokenProgram'
					address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
				},
				{
					name: 'systemProgram'
					address: '11111111111111111111111111111111'
				},
			]
			args: [
				{
					name: 'amount'
					type: 'u64'
				},
			]
		},
		{
			name: 'revoke'
			discriminator: [170, 23, 31, 34, 133, 173, 93, 242]
			accounts: [
				{
					name: 'mintAuthority'
					writable: true
					signer: true
				},
				{
					name: 'mintAccount'
					writable: true
				},
				{
					name: 'tokenProgram'
					address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
				},
			]
			args: []
		},
	]
}
