import mxgraph from "@/config/mxgraph";

let dataList = [
    {
        icon: '/tool_bar_icon/database.png',
        title: '数据',
    },
    {
        icon: '/tool_bar_icon/merge.png',
        title: '合并',
    }
]

const width_config = 128
const height_config = 128
const toolbarItems = [];

for (let i = 0; i < dataList.length; i++) {
    let fs = dataList[i]
    let sg = {
        icon: fs.icon,
        title: fs.title,
        width: width_config,
        height: height_config,
        style: {
            fillColor: 'transparent',
            strokeColor: 'transparent',
            strokeWidth: '1',
            shape: mxgraph.mxConstants.SHAPE_IMAGE,
            align: mxgraph.mxConstants.ALIGN_CENTER,
            verticalAlign: mxgraph.mxConstants.ALIGN_CENTER,
            imageAlign: mxgraph.mxConstants.ALIGN_CENTER,
            imageVerticalAlign: mxgraph.mxConstants.ALIGN_CENTER,
            width: width_config,
            height: height_config,
            image: fs.icon
        }
    }
    toolbarItems.push(sg)
}

export default toolbarItems
