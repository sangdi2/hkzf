import React from "react";
import NavHeader from "../../components/NavHeader";
export default class Map extends React.Component{
    componentDidMount(){
        var map = new window.BMapGL.Map("container");
        var point = new window.BMapGL.Point(116.404, 39.915);
        map.centerAndZoom(point, 15); 
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