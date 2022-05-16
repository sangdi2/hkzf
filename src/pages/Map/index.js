import React from "react";
import NavHeader from "../../components/NavHeader";
export default class Map extends React.Component{
    componentDidMount(){
        const {label,value}=JSON.parse(localStorage.getItem('hkzf_localcity')) 
        var map = new window.BMapGL.Map("container");
                var myGeo = new window.BMapGL.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(label, function(point){
            if(point){
                map.centerAndZoom(point, 11);
                var scaleCtrl = new window.BMapGL.ScaleControl();  // 添加比例尺控件
                map.addControl(scaleCtrl);
                var zoomCtrl = new window.BMapGL.ZoomControl();  // 添加缩放控件
                map.addControl(zoomCtrl);
                                    
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