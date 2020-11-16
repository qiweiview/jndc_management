<template>
    <el-row style="height: 100vh;">
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3" style="height: 100%;">
            <el-menu default-active="channel" class="el-menu-vertical-demo" @select="handleSelect">
                <el-menu-item index="channel">
                    <i class="el-icon-setting"></i>
                    <span slot="title">隧道列表</span>
                </el-menu-item>
                <el-menu-item index="services">
                    <i class="el-icon-setting"></i>
                    <span slot="title">服务列表</span>
                </el-menu-item>
                <el-menu-item index="serverPortList">
                    <i class="el-icon-menu"></i>
                    <span slot="title">服务器端口监听</span>
                </el-menu-item>
            </el-menu>
        </el-col>
        <el-col :xs="21" :sm="21" :md="21" :lg="21" :xl="21" style="height: 100%;">
            <router-view></router-view>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "management",
        data() {
            return {
                hi: 'view'
            }
        },
        methods: {
            handleSelect(key) {
                this.$router.push('/management/'+key)
            }
        }
    }
</script>

<style scoped>

</style>