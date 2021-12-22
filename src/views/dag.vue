<template>
    <el-row style="padding: 15px">
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
            <!--            <div id="tool_bar"></div>-->
            <div class="customToolbarContainer">
                <div class="toolbarContainer">
                    <div v-for="item in toolbarItems" :key="item['title']" ref="toolItem">
                        <img :src="item['icon']" :alt="item['title']" style="width: 64px;height: 64px">
                        <span style="margin-left: 15px">{{item['title']}}</span>
                    </div>
                </div>
            </div>
        </el-col>
        <el-col :xs="17" :sm="17" :md="17" :lg="17" :xl="17">
            <div id="g1"
                 style="position:relative;overflow:hidden;width:100%;height:90vh;background:url('grid.gif');cursor:default;"></div>
        </el-col>
        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
            <div>option area</div>
        </el-col>
    </el-row>
</template>

<script>
    import mxgraph from "@/config/mxgraph";

    import toolbarItems from "@/config/toolbar";

    const {
        mxGraph, mxClient, mxUtils,
        mxShape, mxConnectionConstraint, mxPoint,
        mxPolyline, mxRubberband, mxEvent,
         mxKeyHandler, mxUndoManager
    } = mxgraph;

    export default {
        name: "login",
        computed: {
            toolbarItems: () => toolbarItems
        },
        data() {
            return {
                parent: {},
                g1: {},
                graph: {},
                toolbar: {},
                undoManager: {}
            }
        },
        methods: {
            initDag() {
                let that = this

                // eslint-disable-next-line no-unused-vars
                mxGraph.prototype.getAllConnectionConstraints = function (terminal, source) {
                    if (terminal != null && terminal.shape != null) {
                        if (terminal.shape.stencil != null) {
                            if (terminal.shape.stencil.constraints != null) {
                                return terminal.shape.stencil.constraints;
                            }
                        } else if (terminal.shape.constraints != null) {
                            return terminal.shape.constraints;
                        }
                    }

                    return null;
                };

                // Defines the default constraints for all shapes
                mxShape.prototype.constraints = [new mxConnectionConstraint(new mxPoint(0.25, 0), true),
                    new mxConnectionConstraint(new mxPoint(0.5, 0), true),
                    new mxConnectionConstraint(new mxPoint(0.75, 0), true),
                    new mxConnectionConstraint(new mxPoint(0, 0.25), true),
                    new mxConnectionConstraint(new mxPoint(0, 0.5), true),
                    new mxConnectionConstraint(new mxPoint(0, 0.75), true),
                    new mxConnectionConstraint(new mxPoint(1, 0.25), true),
                    new mxConnectionConstraint(new mxPoint(1, 0.5), true),
                    new mxConnectionConstraint(new mxPoint(1, 0.75), true),
                    new mxConnectionConstraint(new mxPoint(0.25, 1), true),
                    new mxConnectionConstraint(new mxPoint(0.5, 1), true),
                    new mxConnectionConstraint(new mxPoint(0.75, 1), true)];

                // Edges have no connection points
                mxPolyline.prototype.constraints = null;


                if (!mxClient.isBrowserSupported()) {
                    // 判断是否支持mxgraph
                    mxUtils.error('Browser is not supported!', 200, false);
                } else {
                    // 再容器中创建图表


                    let MxGraph = mxGraph;
                    this.g1 = document.getElementById("g1")
                    this.graph = new MxGraph(this.g1);


                    /*获取全局父级*/
                    this.parent = this.graph.getDefaultParent();

                    let graph = this.graph


                    /* ----------- init ----------- */
                    this.initToolbar()
                    this.initKeyboardEvent()
                    /* ----------- init ----------- */


                    /* ----------- 设置配置值 ----------- */
                    /*允许范围选取*/
                    new mxRubberband(graph);

                    /*禁止鼠标右键事件*/
                    mxEvent.disableContextMenu(this.g1);

                    //禁止大小缩放
                    mxGraph.prototype.setCellsResizable(false);

                    /*可连接*/
                    graph.setConnectable(true);


                    /*回退事务管理器*/
                    this.undoManager = new mxUndoManager();
                    let listener = function (sender, evt) {
                        that.undoManager.undoableEditHappened(evt.getProperty('edit'));
                    };
                    this.graph.getModel().addListener(mxEvent.UNDO, listener);
                    this.graph.getView().addListener(mxEvent.UNDO, listener);

                    /* ----------- 设置配置值 ----------- */

                    /*del按钮*/
                    let keyHandler = new mxKeyHandler(graph);
                    // eslint-disable-next-line no-unused-vars
                    keyHandler.bindKey(46, function (evt) {
                        if (graph.isEnabled()) {
                            graph.removeCells();
                        }
                    });




                }
            },
            initKeyboardEvent() {

                // let map = {}; // You could also use an array
                // let onkeydown = onkeyup = function (e) {
                //     e = e || event; // to deal with IE
                //     map[e.keyCode] = e.type == 'keydown';
                //     /* insert conditional here */
                // }
                //
                // document.addEventListener('keydown', onkeydown);

                let that = this
                document.onkeydown = (evt) => {

                    if (!evt) evt = event;

                    if (evt.ctrlKey && evt.keyCode === 90) {
                        evt.preventDefault()
                        that.undoManager.undo()

                    }

                    if (evt.ctrlKey && evt.keyCode === 89) {
                        evt.preventDefault()
                        that.undoManager.redo()

                    }

                    if (evt.ctrlKey && evt.keyCode === 65) {
                        evt.preventDefault()
                        that.graph.selectAll(null,true)
                    }


                }
            },
            addCell(toolItem, x, y) {
                const {width, height} = toolItem
                const styleObj = toolItem['style']

                const style = Object.keys(styleObj).map((attr) => `${attr}=${styleObj[attr]}`).join(';')
                const parent = this.graph.getDefaultParent()


                this.graph.getModel().beginUpdate()
                try {
                    let vertex = this.graph.insertVertex(parent, null, null, x, y, width, height, style)
                    vertex.title = toolItem['title']
                } finally {
                    this.graph.getModel().endUpdate()
                }
            },
            initToolbar() {
                const domArray = this.$refs.toolItem

                if (!(domArray instanceof Array) || domArray.length <= 0) {
                    return
                }
                domArray.forEach((dom, domIndex) => {
                    const toolItem = this.toolbarItems[domIndex]
                    const {width, height} = toolItem

                    const dropHandler = (graph, evt, cell, x, y) => {
                        this.addCell(toolItem, x, y)
                    }
                    const createDragPreview = () => {
                        const elt = document.createElement('div')

                        elt.style.border = '2px dotted black'
                        elt.style.width = `${width}px`
                        elt.style.height = `${height}px`
                        return elt
                    }

                    mxUtils.makeDraggable(dom, this.graph, dropHandler, createDragPreview(), 0, 0, false, true)
                })

                // this.toolbar = new mxToolbar(document.getElementById("tool_bar"));
                // this.toolbar.enabled = false
                // this.addToolBar('https://emojipedia.org/static/img/logo/emojipedia-logo-64.f24011dcde3f.png', 40, 40, 'shape=hexagon');
            },

        },
        mounted() {
            this.initDag()
        }
    }
</script>

<style>
    #g1 {
        border: 1px solid #ccc
    }

    div.mxRubberband {
        position: absolute;
        overflow: hidden;
        border-style: solid;
        border-width: 1px;
        border-color: #0000FF;
        background: #0077FF;
    }
</style>
