const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config();

module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 7545,
            network_id: "*"
        },
        test: {
            host: "localhost",
            port: 8545,
            network_id: "*"
        },
        live: {
            host: "localhost",
            port: 8545,
            gas: 6700000,
            network_id: 1
        },
        rinkeby: {
            provider: function() {
                return new HDWalletProvider(
                    process.env.MNEMONIC,
                    `https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`
                )
            },
            network_id: 4
        }
    },

    compilers: {
        solc: {
            version: "0.6.12",
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },

    plugins: [
        'truffle-plugin-verify'
    ],

    api_keys: {
        etherscan: process.env.ETHERSCAN_API_KEY
    }
};
