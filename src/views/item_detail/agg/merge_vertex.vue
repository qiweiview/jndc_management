<template>
    <div>
        <h3>合并</h3>
        <el-table
                height="600px"
                :data="supportData.unionSources"
                style="width: 100%">
            <el-table-column
                    label="合并"
                    width="180">
                <template slot-scope="scope">
                    {{scope.row.detail}}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "agg_vertex.vue",
        data() {
            return {
                id: "",
                supportData: {}

            }
        },
        methods: {
            /*起始点数据绑定至目标点*/
            bindSourceData(sourceId, source, targetId, target) {


                /* ---- map--- */
                let mapSource = {}
                target.nearSources.forEach(x => {
                    mapSource[x.key] = x
                })

                let nearSource = source.nearSource

                /*判断是否存在该源*/
                let check = mapSource[nearSource.key]
                if (typeof check == "undefined") {
                    //todo 非同源
                    check = nearSource
                    target.nearSources.push(check)
                }

                if (typeof check.mergeColumns == "undefined") {
                    check.mergeColumns = []
                }


                let distinctMap = {}
                check.mergeColumns.forEach(x => {
                    distinctMap[x.detail] = x
                })

                /*聚合列（不会重复）*/
                for (let i = 0; i < source.aggColumnsSelect.length; i++) {
                    let fi = source.aggColumnsSelect[i]
                    let detail = {detail: source.type + '(' + fi.index + ')', index: fi.index, type: source.type}
                    let distinctCheck = distinctMap[detail.detail]
                    if (typeof distinctCheck == "undefined") {
                        check.mergeColumns.push(detail)
                    }
                }

                check.mergeColumns.forEach(x => {
                    distinctMap[x.detail] = x
                })

                /*分组列*/
                source.aggValue.forEach(x => {
                    let detail = {detail: 'agg(' + x.index + ')', index: x.index, type: 'agg'}
                    let distinctCheck = distinctMap[detail.detail]
                    if (typeof distinctCheck == "undefined") {
                        check.mergeColumns.push(detail)
                    }
                })


                /*---------------------*/


                // let nearSources = []
                // /*合并最近数据源*/
                //
                // let mapSource = {}
                // target.nearSources.forEach(x => {
                //     mapSource[x] = x
                // })
                //
                // if (typeof target.nearSources == "undefined") {
                //     target.nearSources = nearSources
                // } else {
                //     if (typeof mapSource[source.nearSource] == "undefined")
                //         target.nearSources.push(source.nearSource)
                // }
                //
                //
                //
                //
                // /*----------------------*/
                //
                // let newAggColumns = []
                //
                // /*遍历添加聚合操作*/
                // for (let i = 0; i < source.aggColumnsSelect.length; i++) {
                //     let fi = source.aggColumnsSelect[i]
                //     let detail = {detail: source.type + '(' + fi.index + ')', index: fi.index}
                //     newAggColumns.push(detail)
                // }
                //
                // if (typeof target.mergeColumns == "undefined") {
                //     target.mergeColumns = newAggColumns
                // } else {
                //     newAggColumns.forEach(x => {
                //         target.mergeColumns.push(x)
                //     })
                // }
                //
                //
                // /*设置聚合值*/
                // let map = {}
                // target.mergeColumns.forEach(x => {
                //     map[x.index] = x.index
                // })
                //
                //
                // source.aggValue.forEach(x => {
                //     let check = map[x.index]
                //     if (typeof check == "undefined") {
                //         let detail = {detail: 'agg(' + x.index + ')', index: x.index}
                //         target.mergeColumns.push(detail)
                //     }
                // })

            },
            getStoreData() {
                let newObject = JSON.parse(JSON.stringify(this.supportData))
                return newObject
            },
            loadStoreData(data) {
                let unionSources = []
                data.nearSources.forEach(x => {
                    x.mergeColumns.forEach(y => {
                        unionSources.push(y)
                    })

                })
                data.unionSources = unionSources
                this.$set(this, 'supportData', data)
            },
            load(id, data) {
                this.id = id
                this.loadStoreData(data)
            },
            initInnerData() {
                let obj = {
                    type: 'merge_vertex',
                    nearSources: [],
                    unionSources: []
                }
                return obj
            },
            acceptCheck(componentType) {
                let allow = ['average_vertex', 'max_vertex', 'min_vertex', 'sum_vertex']
                let check = false
                for (let i = 0; i < allow.length; i++) {
                    if (allow[i] == componentType) {
                        check = true
                    }
                }
                return check
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>
