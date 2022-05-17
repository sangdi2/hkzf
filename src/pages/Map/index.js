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
                var myGeo = new window.BMapGL.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(label, async function(point){
            if(point){
                map.centerAndZoom(point, 11);
                var scaleCtrl = new window.BMapGL.ScaleControl();  // 添加比例尺控件
                map.addControl(scaleCtrl);
                var zoomCtrl = new window.BMapGL.ZoomControl();  // 添加缩放控件
                map.addControl(zoomCtrl);

                const res =await axios.get(`http://localhost:8088/area/map?id=${value}`)
                res.data.body.forEach(item => {
                    var opts = {
                        position: new window.BMapGL.Point(item.coord.longitude,item.coord.latitude), // 指定文本标注所在的地理位置
                        offset: new window.BMapGL.Size(-35, -35) // 设置文本偏移量
                    };
                    // 创建文本标注对象
                    var label = new window.BMapGL.Label('', opts);
                label.setContent(`
                    <div class="${styles.bubble}">
                        <p class="${styles.name}">${item.label}</p>
                        <p>${item.count}套</p>
                    </div>
                    `)
                    // 自定义文本标注样式
                    label.setStyle(labelStyle);
                    label.id=value
                    label.addEventListener('click', () => {
                        console.log('房源覆盖物被点击了', label.id)
          
                        // 放大地图，以当前点击的覆盖物为中心放大地图
                        // 第一个参数：坐标对象
                        // 第二个参数：放大级别
                        map.centerAndZoom(new window.BMapGL.Point(item.coord.longitude,item.coord.latitude), 13)
          
                        // 解决清除覆盖物时，百度地图API的JS文件自身报错的问题
                        setTimeout(() => {
                          // 清除当前覆盖物信息
                          map.clearOverlays()
                        }, 0)
                      })
          
                    map.addOverlay(label);
                });
                                    
            }else{
                alert('您选择的地址没有解析到结果！');
            }
        }, label)
        
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