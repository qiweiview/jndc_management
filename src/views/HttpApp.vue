<template>
    <el-row style="padding: 10px">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <span style="display:block;font-size: 13px;color: #409EFF;padding: 10px">提示：规则生效于服务端配置的web端口</span>

            <el-input clearable v-model="searchKey" placeholder="筛选域名规则"
                      style="width:20%"></el-input>
            <el-button @click="getHostList" style="margin-left:15px">查 询</el-button>
            <el-button @click="openHostCreateBlog" style="margin-left:15px" type="success">新 增</el-button>
            <el-table :data="hostList">
                <el-table-column label="域名规则字符">
                    <template slot-scope="scope"><span style="text-align: left">{{ scope.row.hostKeyWord }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="路由操作">
                    <template slot-scope="scope"><span style="text-align: left">{{ scope.row.returnFixedValue==0?'重定向至地址':'返回固定值' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="重定向地址">
                    <template slot-scope="scope"><span style="text-align: left">{{ scope.row.redirectAddress==''?'未设置':scope.row.redirectAddress }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="info" @click="editHostConfig(scope.row)">编 辑</el-button>
                        <el-button size="mini" type="danger" @click="deleteHostRoute(scope.row)">删 除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="sizeChange"
                    @current-change="pageChange"
                    background
                    :page-sizes="[10, 15, 30, 100]"
                    :page-size="recordRows"
                    layout="sizes, prev, pager, next"
                    :total="chanelRecordTotal">
            </el-pagination>
        </el-col>

        <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" title="新增域名规则" :visible.sync="hostCreateBlog" width="40%">
            <el-form label-position="top">
                <el-form-item label="域名包含字符">
                    <span style="display:block;font-size: 13px;color: #409EFF;padding: 10px">
                         提示：规则将匹配类似{{hostForm.hostKeyWord}}.abc.com或{{hostForm.hostKeyWord}}.abc.cn等域名
                    </span>
                    <el-input style="width: 60%" v-model="hostForm.hostKeyWord"></el-input>
                </el-form-item>

                <el-form-item label="该规则下,使用固定返回值">

                    <el-switch
                            active-text="是"
                            inactive-text="否"
                            v-model="hostForm.isUsedFixedReturn"
                    >
                    </el-switch>

                </el-form-item>

                <el-form-item label="消息类型" v-show="hostForm.isUsedFixedReturn">
                    <el-select v-model="hostForm.contentType" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.value"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="固定返回值" v-show="hostForm.isUsedFixedReturn">
                    <el-input
                            style="font-family: 'Fira Code'"
                            resize="none"
                            type="textarea"
                            :rows="6"
                            placeholder="请输入内容"
                            v-model="hostForm.fixedTextArea">
                    </el-input>
                </el-form-item>

                <el-form-item label="重定向地址" v-show="!hostForm.isUsedFixedReturn">
                    <el-input style="width: 60%" v-model="hostForm.redirectAddress"></el-input>
                    <el-button size="mini" type="primary" style="margin-left: 15px"  @click="openInNewWindow(hostForm.redirectAddress)">测试</el-button>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeHostCreateBlog">取 消</el-button>
                <el-button type="primary" @click="doHostCreate">新 增</el-button>
            </div>
        </el-dialog>

        <el-dialog :close-on-press-escape="false"  :close-on-click-modal="false" title="编辑域名规则" :visible.sync="hostCreateBlogEdit" width="40%">
            <el-form label-position="top">
                <el-form-item label="域名包含字符">
                     <span style="display:block;font-size: 13px;color: #409EFF;padding: 10px">
                        提示：规则将匹配类似{{hostFormEdit.hostKeyWord}}.abc.com或{{hostFormEdit.hostKeyWord}}.abc.cn等域名
                    </span>
                    <el-input style="width: 60%" v-model="hostFormEdit.hostKeyWord"></el-input>
                </el-form-item>

                <el-form-item label="该规则下,使用固定返回值">

                    <el-switch
                            active-text="是"
                            inactive-text="否"
                            v-model="hostFormEdit.isUsedFixedReturn"
                    >
                    </el-switch>

                </el-form-item>

                <el-form-item label="消息类型" v-show="hostFormEdit.isUsedFixedReturn">
                    <el-select v-model="hostFormEdit.contentType" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.value"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="固定返回值" v-show="hostFormEdit.isUsedFixedReturn">
                    <el-input
                            style="font-family: 'Fira Code'"
                            resize="none"
                            type="textarea"
                            :rows="6"
                            placeholder="请输入内容"
                            v-model="hostFormEdit.fixedTextArea">
                    </el-input>
                </el-form-item>

                <el-form-item label="重定向地址" v-show="!hostFormEdit.isUsedFixedReturn">
                    <el-input style="width: 60%" v-model="hostFormEdit.redirectAddress"></el-input>
                    <el-button size="mini" type="primary" style="margin-left: 15px"  @click="openInNewWindow(hostFormEdit.redirectAddress)">测试</el-button>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeHostConfigDialog">取 消</el-button>
                <el-button type="primary" @click="doHostUpdate">更 新</el-button>
            </div>
        </el-dialog>


    </el-row>
</template>

<script>

    import request from "@/config/requestConfig";

    export default {
        name: "serviceList",
        data() {
            return {
                searchKey: '',
                hostList: [],
                recordRows: 10,
                recordCurrentPage: 1,
                chanelRecordTotal: 0,
                hostCreateBlog: false,
                hostCreateBlogEdit: false,
                currentHost: "",
                hostForm: {
                    hostKeyWord: '',
                    isUsedFixedReturn: false,
                    fixedTextArea: '',
                    contentType: 'application/json',
                    redirectAddress: ''
                },
                hostFormEdit: {
                    id: '',
                    hostKeyWord: '',
                    isUsedFixedReturn: false,
                    fixedTextArea: '',
                    contentType: 'application/json',
                    redirectAddress: ''
                },
                options: [
                    {
                        value: 'application/json'
                    },
                    {
                        value: 'application/xml'
                    },
                    {
                        value: 'application/javascript'
                    },
                    {
                        value: 'text/plain'
                    },
                    {
                        value: 'text/html'
                    }
                ]
            }
        },
        methods: {
            openInNewWindow(url){
                window.open(url,'','width=1440,height=900,left=150,top=150')
            },
            deleteHostRoute(row) {

                let _this = this
                this.$confirm('删除该配置，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    request({
                        url: '/deleteHostRouteRule',
                        method: 'post',
                        data: {id: row.id}
                        // eslint-disable-next-line no-unused-vars
                    }).then(response => {
                        if (response.code == 200) {
                            //refresh force
                            _this.$message.success(response.message)
                            _this.getHostList()
                        } else {
                            _this.$message.error(response.message)
                        }
                    }).catch(() => {
                    })


                }).catch(() => {

                });
            },
            doHostCreate() {
                let body = {
                    hostKeyWord: this.hostForm.hostKeyWord,
                    returnFixedValue: this.hostForm.isUsedFixedReturn ? 1 : 0,
                    fixedResponse: this.hostForm.fixedTextArea,
                    redirectAddress: this.hostForm.redirectAddress,
                    fixedContentType: this.hostForm.contentType,
                }
                const loading = this.$loading({
                    lock: true,
                    text: '加载中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                request({
                    url: '/saveHostRouteRule',
                    method: 'post',
                    data: body
                    // eslint-disable-next-line no-unused-vars
                }).then(response => {
                    loading.close()
                    if (response.code == 200) {
                        //refresh force
                        this.$message.success(response.message)
                        this.getHostList()
                        this.closeHostCreateBlog()
                    } else {
                        this.$message.error(response.message)
                    }

                }).catch(() => {
                    loading.close()
                })
            },
            doHostUpdate() {
                let body = {
                    id: this.hostFormEdit.id,
                    hostKeyWord: this.hostFormEdit.hostKeyWord,
                    returnFixedValue: this.hostFormEdit.isUsedFixedReturn ? 1 : 0,
                    fixedResponse: this.hostFormEdit.fixedTextArea,
                    redirectAddress: this.hostFormEdit.redirectAddress,
                    fixedContentType: this.hostFormEdit.contentType,
                }
                const loading = this.$loading({
                    lock: true,
                    text: '加载中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                request({
                    url: '/updateHostRouteRule',
                    method: 'post',
                    data: body
                    // eslint-disable-next-line no-unused-vars
                }).then(response => {
                    loading.close()
                    if (response.code == 200) {
                        //refresh force
                        this.$message.success(response.message)
                        this.getHostList()
                        this.closeHostConfigDialog()
                    } else {
                        this.$message.error(response.message)
                    }

                }).catch(() => {
                    loading.close()
                })
            },
            closeHostCreateBlog() {
                this.hostCreateBlog = false
            },
            openHostCreateBlog() {
                this.hostForm = {
                    hostKeyWord: '',
                    isUsedFixedReturn: false,
                    fixedTextArea: '',
                    contentType: '',
                    redirectAddress: ''
                }
                this.hostCreateBlog = true
            },
            pageChange(page) {
                this.recordCurrentPage = page
                this.getHostList()
            },
            sizeChange(size) {
                this.recordRows = size
                this.getHostList()
            },
            getHostList() {
                const loading = this.$loading({
                    lock: true,
                    text: '加载中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                request({
                    url: '/listHostRouteRule',
                    method: 'post',
                    data: {page: this.recordCurrentPage, rows: this.recordRows, hostKeyWord: this.searchKey}
                    // eslint-disable-next-line no-unused-vars
                }).then(response => {
                    this.hostList = response.data
                    this.chanelRecordTotal = response.total
                    loading.close()
                }).catch(() => {
                    loading.close()
                })
            },
            editHostConfig(row) {
                this.hostFormEdit = {
                    id: row.id,
                    hostKeyWord: row.hostKeyWord,
                    isUsedFixedReturn: row.returnFixedValue == 1,
                    fixedTextArea: row.fixedResponse,
                    contentType: row.fixedContentType,
                    redirectAddress: row.redirectAddress
                }
                this.hostCreateBlogEdit = true
            },
            closeHostConfigDialog() {
                this.hostFormEdit = {
                    id: '',
                    hostKeyWord: '',
                    isUsedFixedReturn: false,
                    fixedTextArea: '',
                    contentType: '',
                    redirectAddress: ''
                }
                this.hostCreateBlogEdit = false
            }

        }, mounted() {
            this.currentHost = window.runtimeConfig.BASE_REQUEST_PATH
            this.getHostList()
        }
    }
</script>

<style scoped>

</style>