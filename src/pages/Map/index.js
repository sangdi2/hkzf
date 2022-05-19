import axios from "axios";
import React from "react";
import NavHeader from "../../components/NavHeader";
import styles from './index.module.css';

const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255, 0, 0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
  }
export default class Map extends React.Component{
    componentDidMount(){
        const {label,value}=JSON.parse(localStorage.getItem('hkzf_localcity')) 
        var map = new window.BMapGL.Map("container");
        this.map=map
        var myGeo = new window.BMapGL.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(label, async point=>{
            if(point){
                map.centerAndZoom(point, 11);
                var scaleCtrl = new window.BMapGL.ScaleControl();  // 添加比例尺控件
                map.addControl(scaleCtrl);
                var zoomCtrl = new window.BMapGL.ZoomControl();  // 添加缩放控件
                map.addControl(zoomCtrl);
                this.renderOverlays(value)
                // const res =await axios.get(`http://localhost:8088/area/map?id=${value}`)
                // res.data.body.forEach(item => {
                //     var opts = {
                //         position: new window.BMapGL.Point(item.coord.longitude,item.coord.latitude), // 指定文本标注所在的地理位置
                //         offset: new window.BMapGL.Size(-35, -35) // 设置文本偏移量
                //     };
                //     // 创建文本标注对象
                //     var label = new window.BMapGL.Label('', opts);
                // label.setContent(`
                //     <div class="${styles.bubble}">
                //         <p class="${styles.name}">${item.label}</p>
                //         <p>${item.count}套</p>
                //     </div>
                //     `)
                //     // 自定义文本标注样式
                //     label.setStyle(labelStyle);
                //     label.id=value
                //     label.addEventListener('click', () => {
                //         console.log('房源覆盖物被点击了', label.id)
          
                //         // 放大地图，以当前点击的覆盖物为中心放大地图
                //         // 第一个参数：坐标对象
                //         // 第二个参数：放大级别
                //         map.centerAndZoom(new window.BMapGL.Point(item.coord.longitude,item.coord.latitude), 13)
          
                //         // 解决清除覆盖物时，百度地图API的JS文件自身报错的问题
                //         setTimeout(() => {
                //           // 清除当前覆盖物信息
                //           map.clearOverlays()
                //         }, 0)
                //       })
          
                //     map.addOverlay(label);
                // });
                                    
            }else{
                alert('您选择的地址没有解析到结果！');
            }
        }, label)
        
    }
    async renderOverlays(id){
        const res=await axios.get(`http://localhost:8088/area/map?id=${id}`)
        const data=res.data.body
        console.log(data)
        const { nextZoom, type } = this.getTypeAndZoom()
        data.forEach(item => {
            // 创建覆盖物
            this.createOverlays(item, nextZoom, type)
          })
    }
    // async renderOverlays(id){
        
    // }
    createOverlays(data, zoom, type){
        const {
            coord: { longitude, latitude },
            label: areaName,
            count,
            value
          } = data
      
          // 创建坐标对象
        //   const areaPoint = new window.BMap.Point(longitude, latitude)
        
      
          if (type === 'circle') {
            // 区或镇
            this.createCircle(longitude, latitude, areaName, count, value, zoom)
          } else {
            // 小区
            this.createRect(longitude, latitude, areaName, count, value)
          }
    }
    createCircle(longitude, latitude, name, count, id, zoom){
        const label = new window.BMapGL.Label('', {
            position: new window.BMapGL.Point(longitude,latitude),
            offset: new window.BMapGL.Size(-35, -35)
          })
      
          // 给 label 对象添加一个唯一标识
          label.id = id
      
          // 设置房源覆盖物内容
          label.setContent(`
            <div class="${styles.bubble}">
              <p class="${styles.name}">${name}</p>
              <p>${count}套</p>
            </div>
          `)
      
          // 设置样式
          label.setStyle(labelStyle)
      
          // 添加单击事件
          label.addEventListener('click', () => {
            // 调用 renderOverlays 方法，获取该区域下的房源数据
            this.renderOverlays(id)
      
            // 放大地图，以当前点击的覆盖物为中心放大地图
            this.map.centerAndZoom( new window.BMapGL.Point(longitude,latitude), zoom)
      
            // 解决清除覆盖物时，百度地图API的JS文件自身报错的问题
            setTimeout(() => {
              // 清除当前覆盖物信息
              this.map.clearOverlays()
            }, 0)
          })
      
          // 添加覆盖物到地图中
          this.map.addOverlay(label)
    }
    getTypeAndZoom(){
        const zoom = this.map.getZoom()
        let nextZoom, type

        // console.log('当前地图缩放级别：', zoom)
        if (zoom >= 10 && zoom < 12) {
        // 区
        // 下一个缩放级别
        nextZoom = 13
        // circle 表示绘制圆形覆盖物（区、镇）
        type = 'circle'
        } else if (zoom >= 12 && zoom < 14) {
        // 镇
        nextZoom = 15
        type = 'circle'
        } else if (zoom >= 14 && zoom < 16) {
        // 小区
        type = 'rect'
        }

        return {
        nextZoom,
        type
        }
    }
    render(){
        return <div className="map">
            <NavHeader >
                地图找房
            </NavHeader>
            <div id="container"></div>
        </div>
    }
}