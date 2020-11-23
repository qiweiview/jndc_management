<template>
    <el-row style="padding: 10px">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-input clearable v-model="searchKey" placeholder="筛选服务器端口号" @change="getServerPortList"
                      style="width:20%"></el-input>
            <el-button @click="openAddPortDialog" type="success" style="margin-left:15px">添 加</el-button>
            <el-button @click="getServerPortList" style="margin-left:15px">查 询</el-button>
            <el-table :data="displayArray">
                <el-table-column label="编号">
                    <template slot-scope="scope"><span style="text-align: left">{{ scope.row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="服务器端口号">
                    <template slot-scope="scope"><span style="text-align: left">{{ scope.row.port }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="端口备注">
                    <template slot-scope="scope"><span style="text-align: left">{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否在监听">
                    <template slot-scope="scope"><span :style="{color:scope.row.portEnable==1?'#67C23A':'#F56C6C'}">{{ scope.row.portEnable==1?'端口监听中':'否' }}</span></template>
                </el-table-column>
                <el-table-column label="服务关联记录">
                    <template slot-scope="scope"><span style="">{{ scope.row.routeTo==null?'未关联过服务':scope.row.routeTo}}</span></template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.portEnable==1" size="mini" type="warning" @click="stopServiceBind(scope.row.id)">暂 停 监 听</el-button>
                        <el-button v-if="scope.row.portEnable==0" size="mini" type="success" @click="openPortBindDialog(scope.row.id)">启 动 监 听</el-button>
                        <el-button v-if="scope.row.portEnable==0" size="mini" type="danger" @click="deleteServiceBindRecord(scope.row.id)">移 除 监 听</el-button>
                        <el-button v-if="scope.row.portEnable==2" size="mini" type="primary" disabled>{{ '监听启动中...' }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="添加端口监听" :visible.sync="addPortDialog" width="20%">
                <el-form :model="portMonitoring">
                    <el-form-item label="端口">
                        <el-input-number v-model="portMonitoring.port" :min="0" :max="16384"
                                         label=""></el-input-number>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="portMonitoring.name" maxlength="10" autocomplete="off"></el-input>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="closeAddPortDialog">取 消</el-button>
                    <el-button type="primary" @click="createPortMonitoring">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="选择绑定服务" :visible.sync="portBindDialog" width="25%">
                <el-table :data="serverChannelList" max-height="250">
                    <el-table-column label="服务名称">
                        <template slot-scope="scope"><span :title="scope.row.id" style="text-align: left">{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="服务本地端口">
                        <template slot-scope="scope"><span
                                style="text-align: center">{{ scope.row.port }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="隧道来源">
                        <template slot-scope="scope"><span
                                style="text-align: center">{{ scope.row.belongContextIp }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" type=""
                                       @click="doServiceBind(scope.row)">选 择
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
        </el-col>
    </el-row>
</template>

<script>
    import request from "@/config/requestConfig";
    import websocket from "@/config/webSocketTool";

    export default {
        name: "serverPortList",
        data() {
            return {
                currentId: '',
                searchKey: '',
                storeArray: [],
                displayArray: [],
                addPortDialog: false,
                portBindDialog: false,
                serverChannelList: [],
                portMonitoring: {
                    name: '',
                    port: ''
                }
            }
        },
        methods: {
            deleteServiceBindRecord(id){
                let _this =this
                this.$confirm('是否删除该端口监听?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    let data = {serverPortId: id}
                    request({
                        url: '/deleteServiceBindRecord',
                        method: 'post',
                        data: data
                        // eslint-disable-next-line no-unused-vars
                    }).then(response => {
                        if (response.code == 200) {
                            //refresh force
                            _this.$message.success(response.message);
                            _this.getServerPortList()
                        } else {
                            _this.$message.error(response.message);
                        }
                        _this.portBindDialog = false
                    }).catch(() => {
                    })

                }).catch(() => {

                });




            },
            stopServiceBind(id){
                let _this =this
                this.$confirm('监听暂停后,已建立连接也将全部断开,是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    let data = {serverPortId: id}
                    request({
                        url: '/stopServiceBind',
                        method: 'post',
                        data: data
                        // eslint-disable-next-line no-unused-vars
                    }).then(response => {
                        if (response.code == 200) {
                            //refresh force
                            _this.$message.success(response.message);
                            _this.getServerPortList()
                        } else {
                            _this.$message.error(response.message);
                        }
                        _this.portBindDialog = false
                    }).catch(() => {
                    })

                }).catch(() => {

                });




            },
            doServiceBind(row) {
                let data = {serverPortId: this.currentId, serviceId: row.id}
                request({
                    url: '/doServiceBind',
                    method: 'post',
                    data: data
                    // eslint-disable-next-line no-unused-vars
                }).then(response => {
                    if (response.code == 200) {
                        //refresh force
                        this.$message.success(response.message);
                        this.getServerPortList()
                    } else {
                        this.$message.error(response.message);
                    }
                    this.portBindDialog = false
                }).catch(() => {
                })

            },
            createPortMonitoring() {
                request({
                    url: '/createPortMonitoring',
                    method: 'post',
                    data: this.portMonitoring
                    // eslint-disable-next-line no-unused-vars
                }).then(response => {
                    if (response.code == 200) {
                        //refresh force
                        this.storeArray = []
                        this.getServerPortList()
                        this.closeAddPortDialog()
                    } else {
                        this.$message.error(response.message);
                    }


                }).catch(() => {
                })
            },
            closeAddPortDialog() {
                this.addPortDialog = false
                this.portMonitoring = {
                    name: '',
                    port: ''

                }
            },
            openAddPortDialog() {
                this.addPortDialog = true
            },
            openPortBindDialog(id) {
                this.currentId = id
                this.portBindDialog = true
                request({
                    url: '/getServiceList',
                    method: 'post',
                    data: {}
                }).then(response => {
                    this.serverChannelList = response
                }).catch(() => {
                })


            },
            getServerPortList() {
                // eslint-disable-next-line no-constant-condition
                if (true) {
                // if (this.storeArray.length == 0) {
                    const loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    })


                    request({
                        url: '/getServerPortList',
                        method: 'post',
                        data: {serverPort: this.portSelect}
                    }).then(response => {
                        this.storeArray = response
                        this.conditionalRendering()
                        loading.close()
                    }).catch(() => {
                        loading.close()
                    })
                } else {
                    this.conditionalRendering()
                }


            },
            conditionalRendering() {
                if ('' == this.searchKey) {
                    this.displayArray = this.storeArray
                } else {
                    let na = []
                    this.storeArray.forEach(x => {
                        if (x.port.indexOf(this.searchKey) !== -1) {
                            na.push(x)
                        }
                    });
                    this.displayArray = na
                }
            }

        }
        , mounted() {
            this.getServerPortList()
            websocket.registerPage('serverPortList','端口监听',this.getServerPortList)
        }
    }
</script>

<style scoped>

</style>