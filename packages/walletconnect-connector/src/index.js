import { __awaiter, __extends, __generator } from "tslib";
import { AbstractConnector } from '@web3-react/abstract-connector';
export var URI_AVAILABLE = 'URI_AVAILABLE';
var UserRejectedRequestError = /** @class */ (function (_super) {
    __extends(UserRejectedRequestError, _super);
    function UserRejectedRequestError() {
        var _this = _super.call(this) || this;
        _this.name = _this.constructor.name;
        _this.message = 'The user rejected the request.';
        return _this;
    }
    return UserRejectedRequestError;
}(Error));
export { UserRejectedRequestError };
function getSupportedChains(_a) {
    var supportedChainIds = _a.supportedChainIds, rpc = _a.rpc;
    if (supportedChainIds) {
        return supportedChainIds;
    }
    return rpc ? Object.keys(rpc).map(function (k) { return Number(k); }) : undefined;
}
var WalletConnectConnector = /** @class */ (function (_super) {
    __extends(WalletConnectConnector, _super);
    function WalletConnectConnector(config) {
        var _this = _super.call(this, { supportedChainIds: getSupportedChains(config) }) || this;
        _this.config = config;
        _this.handleChainChanged = _this.handleChainChanged.bind(_this);
        _this.handleAccountsChanged = _this.handleAccountsChanged.bind(_this);
        _this.handleDisconnect = _this.handleDisconnect.bind(_this);
        return _this;
    }
    WalletConnectConnector.prototype.handleChainChanged = function (chainId) {
        if (__DEV__) {
            console.log("Handling 'chainChanged' event with payload", chainId);
        }
        this.emitUpdate({ chainId: chainId });
    };
    WalletConnectConnector.prototype.handleAccountsChanged = function (accounts) {
        if (__DEV__) {
            console.log("Handling 'accountsChanged' event with payload", accounts);
        }
        this.emitUpdate({ account: accounts[0] });
    };
    WalletConnectConnector.prototype.handleDisconnect = function () {
        if (__DEV__) {
            console.log("Handling 'disconnect' event");
        }
        // we have to do this because of a @walletconnect/web3-provider bug
        if (this.walletConnectProvider) {
            this.walletConnectProvider.removeListener('chainChanged', this.handleChainChanged);
            this.walletConnectProvider.removeListener('accountsChanged', this.handleAccountsChanged);
            this.walletConnectProvider = undefined;
        }
        this.emitDeactivate();
    };
    WalletConnectConnector.prototype.activate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var WalletConnectProvider_1, account;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.walletConnectProvider) return [3 /*break*/, 2];
                        return [4 /*yield*/, import('@walletconnect/ethereum-provider').then(function (m) { var _a; return (_a = m === null || m === void 0 ? void 0 : m.default) !== null && _a !== void 0 ? _a : m; })];
                    case 1:
                        WalletConnectProvider_1 = _a.sent();
                        this.walletConnectProvider = new WalletConnectProvider_1(this.config);
                        _a.label = 2;
                    case 2:
                        if (!!this.walletConnectProvider.connector.connected) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.walletConnectProvider.connector.createSession(this.config.chainId ? { chainId: this.config.chainId } : undefined)];
                    case 3:
                        _a.sent();
                        this.emit(URI_AVAILABLE, this.walletConnectProvider.connector.uri);
                        _a.label = 4;
                    case 4: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var userReject = function () {
                                // Erase the provider manually
                                _this.walletConnectProvider = undefined;
                                reject(new UserRejectedRequestError());
                            };
                            // Workaround to bubble up the error when user reject the connection
                            _this.walletConnectProvider.connector.on('disconnect', function () {
                                // Check provider has not been enabled to prevent this event callback from being called in the future
                                if (!account) {
                                    userReject();
                                }
                            });
                            _this.walletConnectProvider.enable()
                                .then(function (accounts) { return resolve(accounts[0]); })
                                .catch(function (error) {
                                // TODO ideally this would be a better check
                                if (error.message === 'User closed modal') {
                                    userReject();
                                    return;
                                }
                                reject(error);
                            });
                        }).catch(function (err) {
                            throw err;
                        })];
                    case 5:
                        account = _a.sent();
                        this.walletConnectProvider.on('disconnect', this.handleDisconnect);
                        this.walletConnectProvider.on('chainChanged', this.handleChainChanged);
                        this.walletConnectProvider.on('accountsChanged', this.handleAccountsChanged);
                        return [2 /*return*/, { provider: this.walletConnectProvider, account: account }];
                }
            });
        });
    };
    WalletConnectConnector.prototype.getProvider = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.walletConnectProvider];
            });
        });
    };
    WalletConnectConnector.prototype.getChainId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.resolve(this.walletConnectProvider.chainId)];
            });
        });
    };
    WalletConnectConnector.prototype.getAccount = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.resolve(this.walletConnectProvider.accounts).then(function (accounts) { return accounts[0]; })];
            });
        });
    };
    WalletConnectConnector.prototype.deactivate = function () {
        if (this.walletConnectProvider) {
            this.walletConnectProvider.removeListener('disconnect', this.handleDisconnect);
            this.walletConnectProvider.removeListener('chainChanged', this.handleChainChanged);
            this.walletConnectProvider.removeListener('accountsChanged', this.handleAccountsChanged);
            this.walletConnectProvider.disconnect();
        }
    };
    WalletConnectConnector.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.emitDeactivate();
                return [2 /*return*/];
            });
        });
    };
    return WalletConnectConnector;
}(AbstractConnector));
export { WalletConnectConnector };
//# sourceMappingURL=index.js.map