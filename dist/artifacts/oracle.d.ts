export type Oracle = {
    "version": "0.1.0";
    "name": "oracle";
    "instructions": [
        {
            "name": "initialize";
            "accounts": [
                {
                    "name": "authority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "controller";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "rent";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "bump";
                    "type": "u8";
                },
                {
                    "name": "version";
                    "type": "u16";
                }
            ];
        },
        {
            "name": "addProduct";
            "accounts": [
                {
                    "name": "authority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "controller";
                    "isMut": true;
                    "isSigner": false;
                    "docs": [
                        "authority required"
                    ];
                },
                {
                    "name": "product";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "price";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "quoteMint";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "baseMint";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "rent";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "productBump";
                    "type": "u8";
                },
                {
                    "name": "priceBump";
                    "type": "u8";
                },
                {
                    "name": "quoteCurrency";
                    "type": "string";
                },
                {
                    "name": "baseCurrency";
                    "type": "string";
                },
                {
                    "name": "assetType";
                    "type": {
                        "defined": "AssetType";
                    };
                },
                {
                    "name": "expo";
                    "type": "i32";
                },
                {
                    "name": "maxPrice";
                    "type": "u64";
                },
                {
                    "name": "minPrice";
                    "type": "u64";
                },
                {
                    "name": "windowSize";
                    "type": "u64";
                }
            ];
        },
        {
            "name": "addPublisher";
            "accounts": [
                {
                    "name": "authority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "authorityPublisher";
                    "isMut": false;
                    "isSigner": false;
                    "docs": [
                        "UNCHECK: We don't read or write from this account."
                    ];
                },
                {
                    "name": "controller";
                    "isMut": true;
                    "isSigner": false;
                    "docs": [
                        "authority required"
                    ];
                },
                {
                    "name": "product";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "publisher";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "rent";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "bump";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "removePublisher";
            "accounts": [
                {
                    "name": "authority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "controller";
                    "isMut": true;
                    "isSigner": false;
                    "docs": [
                        "authority required"
                    ];
                },
                {
                    "name": "product";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "publisher";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "rent";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [];
        },
        {
            "name": "postPrice";
            "accounts": [
                {
                    "name": "authority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "product";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "price";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "publisher";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "rent";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "price";
                    "type": "u64";
                }
            ];
        },
        {
            "name": "setProductTokens";
            "accounts": [
                {
                    "name": "authority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "controller";
                    "isMut": true;
                    "isSigner": false;
                    "docs": [
                        "authority required"
                    ];
                },
                {
                    "name": "product";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "quoteMint";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "baseMint";
                    "isMut": false;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [];
        },
        {
            "name": "setSafeRange";
            "accounts": [
                {
                    "name": "authority";
                    "isMut": true;
                    "isSigner": true;
                },
                {
                    "name": "controller";
                    "isMut": true;
                    "isSigner": false;
                    "docs": [
                        "authority required"
                    ];
                },
                {
                    "name": "product";
                    "isMut": true;
                    "isSigner": false;
                },
                {
                    "name": "systemProgram";
                    "isMut": false;
                    "isSigner": false;
                }
            ];
            "args": [
                {
                    "name": "maxPrice";
                    "type": "u64";
                },
                {
                    "name": "minPrice";
                    "type": "u64";
                }
            ];
        }
    ];
    "accounts": [
        {
            "name": "controller";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "version";
                        "type": "u16";
                    },
                    {
                        "name": "authority";
                        "type": "publicKey";
                    },
                    {
                        "name": "bump";
                        "type": {
                            "array": [
                                "u8",
                                1
                            ];
                        };
                    }
                ];
            };
        },
        {
            "name": "price";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "version";
                        "type": "u16";
                    },
                    {
                        "name": "status";
                        "type": {
                            "defined": "PriceStatus";
                        };
                    },
                    {
                        "name": "productAccount";
                        "type": "publicKey";
                    },
                    {
                        "name": "price";
                        "type": "u64";
                    },
                    {
                        "name": "numPublishers";
                        "type": "u16";
                    },
                    {
                        "name": "timestamp";
                        "type": "u64";
                    },
                    {
                        "name": "prevPrice";
                        "type": "u64";
                    },
                    {
                        "name": "prevTimestamp";
                        "type": "u64";
                    },
                    {
                        "name": "bump";
                        "type": {
                            "array": [
                                "u8",
                                1
                            ];
                        };
                    }
                ];
            };
        },
        {
            "name": "product";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "version";
                        "type": "u16";
                    },
                    {
                        "name": "status";
                        "type": {
                            "defined": "ProductStatus";
                        };
                    },
                    {
                        "name": "assetType";
                        "type": {
                            "defined": "AssetType";
                        };
                    },
                    {
                        "name": "quoteCurrency";
                        "docs": [
                            "e.g. \"USD\" null padded (`*b\"USD\\0\\0\\0\\0\\0\\0\\0\\0\\0\\0\\0\\0\\0\\0\\0\\0\\0\\0\\0\\0\\0\\0\\0\\0\\0\\0\\0\\0\\0\"`) or a SPL token mint pubkey"
                        ];
                        "type": "string";
                    },
                    {
                        "name": "quoteMint";
                        "type": "publicKey";
                    },
                    {
                        "name": "baseCurrency";
                        "type": "string";
                    },
                    {
                        "name": "baseMint";
                        "type": "publicKey";
                    },
                    {
                        "name": "priceAccount";
                        "type": "publicKey";
                    },
                    {
                        "name": "expo";
                        "type": "i32";
                    },
                    {
                        "name": "maxPrice";
                        "type": "u64";
                    },
                    {
                        "name": "minPrice";
                        "type": "u64";
                    },
                    {
                        "name": "windowSize";
                        "type": "u64";
                    },
                    {
                        "name": "controller";
                        "type": "publicKey";
                    },
                    {
                        "name": "bump";
                        "type": {
                            "array": [
                                "u8",
                                1
                            ];
                        };
                    }
                ];
            };
        },
        {
            "name": "publisher";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "status";
                        "type": {
                            "defined": "PublisherStatus";
                        };
                    },
                    {
                        "name": "authority";
                        "type": "publicKey";
                    },
                    {
                        "name": "product";
                        "type": "publicKey";
                    },
                    {
                        "name": "lastPushTimestamp";
                        "type": "u64";
                    },
                    {
                        "name": "controller";
                        "type": "publicKey";
                    },
                    {
                        "name": "bump";
                        "type": {
                            "array": [
                                "u8",
                                1
                            ];
                        };
                    }
                ];
            };
        }
    ];
    "types": [
        {
            "name": "ErrorCode";
            "type": {
                "kind": "enum";
                "variants": [
                    {
                        "name": "InvalidInput";
                    },
                    {
                        "name": "NumberCastError";
                    },
                    {
                        "name": "InvalidStringLength";
                    },
                    {
                        "name": "InitializedAccount";
                    },
                    {
                        "name": "InvalidTimestampConversion";
                    },
                    {
                        "name": "InputInvalidAccount";
                    },
                    {
                        "name": "InputInvalidPrice";
                    },
                    {
                        "name": "Overflow";
                    },
                    {
                        "name": "PriceOutOfDate";
                    },
                    {
                        "name": "UnavailableProduct";
                    }
                ];
            };
        },
        {
            "name": "PriceStatus";
            "type": {
                "kind": "enum";
                "variants": [
                    {
                        "name": "Unknown";
                    },
                    {
                        "name": "Offline";
                    },
                    {
                        "name": "Online";
                    }
                ];
            };
        },
        {
            "name": "AssetType";
            "type": {
                "kind": "enum";
                "variants": [
                    {
                        "name": "Forex";
                    },
                    {
                        "name": "Crypto";
                    }
                ];
            };
        },
        {
            "name": "ProductStatus";
            "type": {
                "kind": "enum";
                "variants": [
                    {
                        "name": "Unknown";
                    },
                    {
                        "name": "Offline";
                    },
                    {
                        "name": "Online";
                    }
                ];
            };
        },
        {
            "name": "PublisherStatus";
            "type": {
                "kind": "enum";
                "variants": [
                    {
                        "name": "Unknown";
                    },
                    {
                        "name": "Valid";
                    }
                ];
            };
        }
    ];
};
export declare const IDL: Oracle;
