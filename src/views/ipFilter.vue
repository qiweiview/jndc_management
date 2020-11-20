<template>
    <el-row style="padding: 10px">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-tabs v-model="activeName" @tab-click="clickTab">
                <el-tab-pane label="IP黑名单" name="a">
                    <span style="display:block;font-size: 13px;color: #409EFF;padding: 10px">提示：黑名单内IP将被过滤</span>
                    <el-button size="mini" type="success" @click="openAddBlackPage">添 加</el-button>
                    <el-button size="mini" type="info" @click="getIpBlackList">刷 新</el-button>
                    <el-table :data="ipBlackList">
                        <el-table-column label="ip地址">
                            <template slot-scope="scope"><span style="text-align: left">{{ scope.row.ip }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="danger" @click="deleteRule(scope.row.id,1)">移 除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="IP白名单" name="b">
                    <span style="display: block; font-size: 13px;color: red;padding: 10px">注意：仅白名单内IP允许放行,且优先级高于黑名单，务必谨慎设置</span>
                    <el-button size="mini" type="success" @click="openAddWhitePage">添 加</el-button>
                    <el-button size="mini" type="info" @click="getIpWhiteList">刷 新</el-button>
                    <el-table :data="ipWhiteList">
                        <el-table-column label="ip地址">
                            <template slot-scope="scope"><span style="text-align: left">{{ scope.row.ip }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="danger" @click="deleteRule(scope.row.id,0)">移 除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="拦截记录" name="c">
                    <el-button size="mini" type="info" @click="getBlockRecord">刷 新</el-button>
                    <el-table :data="blockIpList">
                        <el-table-column label="ip地址">
                            <template slot-scope="scope"><span style="text-align: left">{{ scope.row.ip }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="访问次数">
                            <template slot-scope="scope"><span style="text-align: left">{{ scope.row.count }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="最后记录时间">
                            <template slot-scope="scope"><span style="text-align: left">{{new Date(scope.row.lastTimeStamp).toLocaleString()  }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="success" @click="addBlockIpToWhiteList(scope.row.ip)">加入白名单
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="访问记录" name="d">
                    <el-button size="mini" type="info" @click="getReleaseRecord">刷 新</el-button>
                    <el-table :data="releaseIpList">
                        <el-table-column label="ip地址">
                            <template slot-scope="scope"><span style="text-align: left">{{ scope.row.ip }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="访问次数">
                            <template slot-scope="scope"><span style="text-align: left">{{ scope.row.count }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="最后记录时间">
                            <template slot-scope="scope"><span style="text-align: left">{{new Date(scope.row.lastTimeStamp).toLocaleString()  }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="danger" @click="addReleaseIpToBlackList(scope.row.ip)">
                                    加入黑名单
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-col>
        <el-dialog title="添加IP黑名单" :visible.sync="blackAddPage" width="20%">
            <el-form>
                <el-form-item label="IP地址">
                    <el-input style="width: 20%" maxlength="3" v-model="ipBlack.a" autocomplete="off"></el-input>
                    <span>·</span>
                    <el-input style="width: 20%" maxlength="3" v-model="ipBlack.b" autocomplete="off"></el-input>
                    <span>·</span>
                    <el-input style="width: 20%" maxlength="3" v-model="ipBlack.c" autocomplete="off"></el-input>
                    <span>·</span>
                    <el-input style="width: 20%" maxlength="3" v-model="ipBlack.d" autocomplete="off"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAddBlackPage">取 消</el-button>
                <el-button type="primary" @click="sendAddBlack">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="添加IP白" :visible.sync="whiteAddPage" width="20%">
            <el-form>
                <el-form-item label="IP地址">
                    <el-input style="width: 20%" maxlength="3" v-model="ipWhite.a" autocomplete="off"></el-input>
                    <span>·</span>
                    <el-input style="width: 20%" maxlength="3" v-model="ipWhite.b" autocomplete="off"></el-input>
                    <span>·</span>
                    <el-input style="width: 20%" maxlength="3" v-model="ipWhite.c" autocomplete="off"></el-input>
                    <span>·</span>
                    <el-input style="width: 20%" maxlength="3" v-model="ipWhite.d" autocomplete="off"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAddWhitePage">取 消</el-button>
                <el-button type="primary" @click="sendAddWhite">确 定</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>

<script>
    import request from "@/config/requestConfig";

    export default {
        name: "ipFilter",
        data() {
            return {
                activeName: 'a',
                ipBlackList: [],
                ipWhiteList: [],
                releaseIpList: [],
                blockIpList: [],
                blackAddPage: false,
                whiteAddPage: false,
                ipBlack: {
                    a: 0,
                    b: 0,
                    c: 0,
                    d: 0,
                },
                ipWhite: {
                    a: 0,
                    b: 0,
                    c: 0,
                    d: 0,
                }
            }
        },
        methods: {
            addBlockIpToWhiteList(ip) {
                this.activeName='b'
                let arr = ip.split(".")
                if (arr.length != 4) {
                    this.$message.error("错误的ip")
                }
                this.whiteAddPage = true
                this.ipWhite = {
                    a: arr[0],
                    b: arr[1],
                    c: arr[2],
                    d: arr[3],
                }

            },
            addReleaseIpToBlackList(ip) {
                this.activeName='a'
                let arr = ip.split(".")
                if (arr.length != 4) {
                    this.$message.error("错误的ip")
                }
                this.blackAddPage = true
                this.ipBlack = {
                    a: arr[0],
                    b: arr[1],
                    c: arr[2],
                    d: arr[3],
                }

            },
            checkIpAddress(ip) {
                let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                return reg.test(ip);
            },
            sendAddBlack() {
                let ip = this.ipBlack.a + "." + this.ipBlack.b + "." + this.ipBlack.c + "." + this.ipBlack.d
                if (this.checkIpAddress(ip)) {
                    request({
                        url: '/addToIpBlackList',
                        method: 'post',
                        data: {ip: ip}
                        // eslint-disable-next-line no-unused-vars
                    }).then(response => {
                        if (response.code == 200) {
                            //refresh force
                            this.$message.success(response.message)
                            this.getIpBlackList()
                            this.closeAddBlackPage()
                        } else {
                            this.$message.error(response.message)
                        }
                    }).catch(() => {
                    })
                } else {
                    this.$message.error("非法的IP地址：" + ip);
                }
            },
            sendAddWhite() {
                let ip = this.ipWhite.a + "." + this.ipWhite.b + "." + this.ipWhite.c + "." + this.ipWhite.d
                if (this.checkIpAddress(ip)) {
                    request({
                        url: '/addToIpWhiteList',
                        method: 'post',
                        data: {ip: ip}
                        // eslint-disable-next-line no-unused-vars
                    }).then(response => {
                        if (response.code == 200) {
                            //refresh force
                            this.$message.success(response.message);
                            this.getIpWhiteList()
                        } else {
                            this.$message.error(response.message);
                        }
                    }).catch(() => {
                    })
                } else {
                    this.$message.error("非法的IP地址：" + ip);
                }
            },
            openAddBlackPage() {
                this.blackAddPage = true
            },
            openAddWhitePage() {
                this.whiteAddPage = true
            },
            closeAddBlackPage() {
                this.blackAddPage = false
                this.ipBlack = {
                    a: 0,
                    b: 0,
                    c: 0,
                    d: 0,
                }
            },
            closeAddWhitePage() {
                this.whiteAddPage = false
                this.ipWhite = {
                    a: 0,
                    b: 0,
                    c: 0,
                    d: 0,
                }
            },
            clickTab(tab) {
                if (tab.name == "a") {
                    this.getIpBlackList()
                }

                if (tab.name == "b") {
                    this.getIpWhiteList()
                }

                if (tab.name == "c") {
                    this.getBlockRecord()
                }

                if (tab.name == "d") {
                    this.getReleaseRecord()
                }

            },
            getIpBlackList() {
                request({
                    url: '/blackList',
                    method: 'post',
                    data: {}
                    // eslint-disable-next-line no-unused-vars
                }).then(response => {
                    this.ipBlackList = response
                }).catch(() => {
                })
            },
            getIpWhiteList() {
                request({
                    url: '/whiteList',
                    method: 'post',
                    data: {}
                    // eslint-disable-next-line no-unused-vars
                }).then(response => {
                    this.ipWhiteList = response
                }).catch(() => {
                })
            },
            getReleaseRecord() {
                request({
                    url: '/releaseRecord',
                    method: 'post',
                    data: {}
                    // eslint-disable-next-line no-unused-vars
                }).then(response => {
                    this.releaseIpList = response
                }).catch(() => {
                })
            },
            getBlockRecord() {
                request({
                    url: '/blockRecord',
                    method: 'post',
                    data: {}
                    // eslint-disable-next-line no-unused-vars
                }).then(response => {
                    this.blockIpList = response
                }).catch(() => {
                })
            },
            deleteRule(id, tag) {
                request({
                    url: '/deleteIpRuleByPrimaryKey',
                    method: 'post',
                    data: {id: id}
                    // eslint-disable-next-line no-unused-vars
                }).then(response => {
                    if (response.code == 200) {
                        //refresh force
                        this.$message.success(response.message)
                        if (tag == 0) {
                            this.getIpWhiteList()
                        } else {
                            this.getIpBlackList()
                        }

                    } else {
                        this.$message.error(response.message)
                    }
                }).catch(() => {
                })
            }
        },
        mounted: function () {
            this.getIpBlackList()
        }
    }
</script>

<style scoped>

</style>