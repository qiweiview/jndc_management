<template>
    <div>
        <h3>合并</h3>
        <el-table
                height="600px"
                :data="supportData.mergeColumns"
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
            bindSourceData(source, target) {



                let newAggColumns = []
                for (let i = 0; i < source.aggColumnsSelect.length; i++) {
                    let fi = source.aggColumnsSelect[i]
                    let detail = {detail: source.type+'('+fi.index+')',index:fi.index}
                    newAggColumns.push(detail)
                }
                if (typeof target.mergeColumns == "undefined") {
                    target.mergeColumns = newAggColumns
                } else {
                    newAggColumns.forEach(x => {
                        target.mergeColumns.push(x)
                    })
                }

                let map={}
                target.mergeColumns.forEach(x=>{
                    map[x.index]=x.index
                    console.log('for0000000Each-->',x.index)
                })


                source.aggValue.forEach(x=>{
                    let check=map[x.index]
                    console.log('forEach-->',map,x,x.index)
                    if (typeof check=="undefined"){
                        let detail = {detail:'agg('+x.index+')',index:x.index}
                        target.mergeColumns.push(detail)
                    }
                })

            },
            getStoreData() {
                let newObject = JSON.parse(JSON.stringify(this.supportData))
                return newObject
            },
            loadStoreData(data) {
                this.$set(this, 'supportData', data)
            },
            load(id, data) {
                this.id = id
                this.loadStoreData(data)
            },
            initInnerData() {
                let obj = {
                    type:'merge_vertex',
                    mergeColumns: []
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
