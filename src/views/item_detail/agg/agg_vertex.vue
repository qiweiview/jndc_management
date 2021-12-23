<template>
    <div>
        <el-table
                :data="aggColumnsSelect"
                style="width: 100%">
            <el-table-column
                    label="日期"
                    width="180">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.index" placeholder="请选择">
                        <el-option
                                v-for="item in aggColumns"
                                :key="item.index"
                                :label="item.index"
                                :value="item.index">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            type="danger"
                            @click="remove(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-button @click="addOne">添加</el-button>
    </div>
</template>

<script>
    export default {
        name: "agg_vertex.vue",
        data() {
            return {
                id: "",
                aggColumns: [
                    {index: 0},
                    {index: 1},
                    {index: 2}],
                aggColumnsSelect: []
            }
        },
        methods: {
            remove(row) {
                console.log(this.aggColumnsSelect)
                let na = []
                this.aggColumnsSelect.forEach(x => {
                    if (x != row) {
                        na.push(x)
                    }
                })


                this.$set(this, 'aggColumnsSelect', na)
                console.log(this.aggColumnsSelect)
            },
            addOne() {
                this.aggColumnsSelect.push({index:0})
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>
