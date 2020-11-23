<template>
    <el-row style="padding: 10px">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-input clearable v-model="searchKey" placeholder="筛选服务名称或隧道来源" @change="getServiceList"
                      style="width:20%"></el-input>
            <el-button @click="getServiceList" style="margin-left:15px">查询</el-button>
            <el-table :data="displayArray">
                <el-table-column label="服务编号">
                    <template slot-scope="scope"><span style="text-align: left">{{ scope.row.id }}</span></template>
                </el-table-column>
                <el-table-column label="服务名称">
                    <template slot-scope="scope"><span style="text-align: left">{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="服务本地IP">
                    <template slot-scope="scope"><span style="">{{ scope.row.ip }}</span></template>
                </el-table-column>
                <el-table-column label="服务本地端口">
                    <template slot-scope="scope"><span style="">{{ scope.row.port }}</span></template>
                </el-table-column>
                <el-table-column label="隧道来源">
                    <template slot-scope="scope"><span
                            style="text-align: center">{{ scope.row.belongContextIp }}</span>
                    </template>
                </el-table-column>
<!--                <el-table-column label="操作">-->
<!--                    <template slot-scope="scope">-->
<!--                        <el-button size="mini" type="danger" @click="pauseService(scope.row.name)">注 销 服 务</el-button>-->
<!--                    </template>-->
<!--                </el-table-column>-->
            </el-table>
        </el-col>
    </el-row>
</template>

<script>
    import request from "@/config/requestConfig";
    import websocket from "@/config/webSocketTool";

    export default {
        name: "serviceList",
        data() {
            return {
                searchKey: '',
                storeArray: [],
                displayArray: []
            }
        },
        methods: {
            pauseService(id) {

                this.$confirm('注销服务 "' + id + '" 后,相关联的连接均会断开，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {


                    request({
                        url: '/',
                        method: 'post',
                        data: {id: id}
                        // eslint-disable-next-line no-unused-vars
                    }).then(response => {
                        this.getServerChannelTable()
                    }).catch(() => {
                    })


                }).catch(() => {

                });


            },
            getServiceList() {
                // eslint-disable-next-line no-constant-condition
                if (true) {
                    const loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    })


                    request({
                        url: '/getServiceList',
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
                        if (x.name.indexOf(this.searchKey) !== -1 || x.belongContextIp.indexOf(this.searchKey) !== -1) {
                            na.push(x)
                        }
                    });
                    this.displayArray = na
                }
            }

        }
        , mounted() {
            this.getServiceList()
            websocket.registerPage('serviceList','服务注册',this.getServiceList)
        }
    }
</script>

<style scoped>

</style>