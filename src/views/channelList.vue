<template>
    <el-row style="padding: 10px">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-input clearable v-model="searchKey" placeholder="筛选隧道编号或IP" @change="getServerChannelTable"
                      style="width:20%"></el-input>
            <el-button @click="getServerChannelTable" style="margin-left:15px">查询</el-button>
            <el-table :data="displayArray">
                <el-table-column label="隧道编号">
                    <template slot-scope="scope"><span style="text-align: left">{{ scope.row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="隧道客户端IP">
                    <template slot-scope="scope"><span style="">{{ scope.row.channelClientIp }}</span></template>
                </el-table-column>
                <el-table-column label="隧道客户端端口">
                    <template slot-scope="scope"><span style="">{{ scope.row.channelClientPort }}</span></template>
                </el-table-column>
                <el-table-column label="注册服务数">
                    <template slot-scope="scope"><span
                            style="text-align: center">{{ scope.row.supportServiceNum }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="danger"
                                   @click="closeChannelByServer(scope.row.id,scope.row.supportServiceNum)">断 开
                        </el-button>
                        <el-button size="mini" type="success"
                                   @click="sendHeartBeat(scope.row.id)">发 送 心 跳
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
    </el-row>
</template>

<script>
    import request from "@/config/requestConfig";

    export default {
        name: "channelList",
        data() {
            return {
                searchKey: '',
                storeArray: [],
                displayArray: []
            }
        },
        methods: {
            sendHeartBeat(id){
                request({
                    url: '/sendHeartBeat',
                    method: 'post',
                    data: {id: id}
                    // eslint-disable-next-line no-unused-vars
                }).then(response => {
                    if (response.code == 200) {
                        //refresh force
                        this.$message.success(response.message);
                    } else {
                        this.$message.error(response.message);
                    }
                }).catch(() => {
                })
            },
            closeChannelByServer(channelId, ports) {
                let _this = this

                this.$confirm('断开隧道后,隧道提供的：' + ports + '项服务将不再被使用，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {


                    request({
                        url: '/closeChannelByServer',
                        method: 'post',
                        data: {id: channelId}
                        // eslint-disable-next-line no-unused-vars
                    }).then(response => {
                        if (response.code == 200) {
                            //refresh force
                            _this.$message.success(response.message);
                            _this.getServerChannelTable()
                        } else {
                            _this.$message.error(response.message);
                        }
                    }).catch(() => {
                    })


                }).catch(() => {

                });


            },
            getServerChannelTable() {
                // eslint-disable-next-line no-constant-condition
                if (true) {
                    const loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    })


                    request({
                        url: '/getServerChannelTable',
                        method: 'post',
                        data: {}
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
                        if (x.id.indexOf(this.searchKey) !== -1 || x.channelClientIp.indexOf(this.searchKey) !== -1) {
                            na.push(x)
                        }
                    });
                    this.displayArray = na
                }
            }

        }
        , mounted() {
            this.getServerChannelTable()
        }
    }
</script>

<style scoped>

</style>