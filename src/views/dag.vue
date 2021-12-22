<template>
    <el-row style="padding: 15px">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <div id="tool_bar"></div>
            <div class="customToolbarContainer">
                <div class="toolbarContainer">
                    <div v-for="item in toolbarItems" :key="item['title']" ref="toolItem">
                        <img :src="item['icon']" :alt="item['title']" style="width: 64px;height: 64px">
                        <span>{{item['title']}}</span>
                    </div>
                </div>
            </div>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <div id="g1"
                 style="position:relative;overflow:hidden;width:100%;height:90vh;background:url('grid.gif');cursor:default;"></div>
        </el-col>
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <div>option area</div>
        </el-col>
    </el-row>
</template>

<script>
    import mxgraph from "@/config/mxgraph";

    import {toolbarItems} from  "@/config/toolbar";

    const {
        mxGraph, mxClient, mxCodec, mxUtils,
        mxShape, mxConnectionConstraint, mxPoint,
        mxPolyline, mxRubberband, mxEvent,
        mxCellState, mxKeyHandler, mxCell, mxGeometry
    } = mxgraph;

    export default {
        name: "login",
        computed: {
            toolbarItems: () => toolbarItems
        },
        data() {
            return {
                g1: {},
                graph: {},
                toolbar:{}
            }
        },
        methods: {
            addCell(toolItem, x, y) {
                const {width, height} = toolItem
                const styleObj = toolItem['style']

                const style = Object.keys(styleObj).map((attr) => `${attr}=${styleObj[attr]}`).join(';')
                const parent = this.graph.getDefaultParent()


                this.graph.getModel().beginUpdate()
                try {
                    let vertex = this.graph.insertVertex(parent, null, null, x, y, width, height,style)
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
            initDag() {

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
                    let MxCodec = mxCodec;
                    this.g1 = document.getElementById("g1")
                    this.graph = new MxGraph(this.g1);

                    let graph = this.graph


                    /* =========init============= */
                    this.initToolbar()
                    /* =========init============= */

                    // 允许范围选取
                    new mxRubberband(graph);
                    /*鼠标事件*/
                    mxEvent.disableContextMenu(this.g1);

                    graph.setConnectable(true);

                    graph.getStylesheet().getDefaultEdgeStyle()['edgeStyle'] = 'orthogonalEdgeStyle';


                    let keyHandler = new mxKeyHandler(graph);
                    // eslint-disable-next-line no-unused-vars
                    keyHandler.bindKey(46, function (evt) {
                        if (graph.isEnabled()) {
                            graph.removeCells();
                        }
                    });

                    // eslint-disable-next-line no-unused-vars
                    graph.connectionHandler.createEdgeState = function (me) {

                        let edge = graph.createEdge(null, null, null, null, null);

                        return new mxCellState(this.graph.view, edge, this.graph.getCellStyle(edge));
                    };

                    // 生成 Hello world!

                    // graph.getModel().beginUpdate();
                    // try {
                    //
                    // } finally {
                    //     // Updates the display
                    //     graph.getModel().endUpdate();
                    // }
                    // 打包XML文件
                    let encoder = new MxCodec();
                    let xx = encoder.encode(graph.getModel());
                    // 保存到getXml参数中
                    this.getXml = mxUtils.getXml(xx);
                }
            },
            addToolBar(icon, w, h, style) {
                let that = this
                let vertex = new mxCell(null, new mxGeometry(0, 0, w, h), style);
                vertex.setVertex(true);

                let img = this.addToolbarItem(that.graph, that.toolbar, vertex, icon);
                img.enabled = true;

                that.graph.getSelectionModel().addListener(mxEvent.CHANGE, function () {
                    let tmp = that.graph.isSelectionEmpty();
                    mxUtils.setOpacity(img, (tmp) ? 100 : 20);
                    img.enabled = tmp;
                });
            },
            addToolbarItem(graph, toolbar, prototype, image) {


                // Function that is executed when the image is dropped on
                // the graph. The cell argument points to the cell under
                // the mousepointer if there is one.
                let funct = function (graph, evt, cell, x, y) {
                    graph.stopEditing(false);

                    let vertex = graph.getModel().cloneCell(prototype);
                    vertex.geometry.x = x;
                    vertex.geometry.y = y;

                    graph.addCell(vertex);
                    graph.setSelectionCell(vertex);
                }

                // Creates the image which is used as the drag icon (preview)
                let img = toolbar.addMode(null, image, function (evt, cell) {
                    let pt = this.graph.getPointForEvent(evt);
                    funct(graph, evt, cell, pt.x, pt.y);
                });



                // eslint-disable-next-line no-unused-vars
                mxEvent.addListener(img, 'mousedown', function (evt) {
                    // do nothing
                });

                // This listener is always called first before any other listener
                // in all browsers.
                mxEvent.addListener(img, 'mousedown', function (evt) {
                    if (img.enabled == false) {
                        mxEvent.consume(evt);
                    }
                });

                mxUtils.makeDraggable(img, graph, funct);

                return img;
            }
        },
        mounted() {
            this.initDag()
        }
    }
</script>

<style>
    div.mxRubberband {
        position: absolute;
        overflow: hidden;
        border-style: solid;
        border-width: 1px;
        border-color: #0000FF;
        background: #0077FF;
    }
</style>
