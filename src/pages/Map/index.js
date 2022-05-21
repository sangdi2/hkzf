import axios from "axios";
import React from "react";
import NavHeader from "../../components/NavHeader";
import styles from './index.module.css';
import { Link } from 'react-router-dom'
import { Toast } from "antd-mobile";

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
  state = {
    // 小区下的房源列表
    housesList: [],
    // 表示是否展示房源列表
    isShowList: false
  }
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
        Toast.loading('加载中。。。',0,null,false)
        const res=await axios.get(`http://localhost:8088/area/map?id=${id}`)
        Toast.hide()
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
    createRect(longitude, latitude,name, count, id){
      const label = new window.BMapGL.Label('', {
        position: new window.BMapGL.Point(longitude,latitude),
        offset: new window.BMapGL.Size(-50, -28)
      })
  
      // 给 label 对象添加一个唯一标识
      label.id = id
  
      // 设置房源覆盖物内容
      label.setContent(`
        <div class="${styles.rect}">
          <span class="${styles.housename}">${name}</span>
          <span class="${styles.housenum}">${count}套</span>
          <i class="${styles.arrow}"></i>
        </div>
      `)
  
      // 设置样式
      label.setStyle(labelStyle)
  
      // 添加单击事件
      label.addEventListener('click', () => {
        /* 
          1 创建 Label 、设置样式、设置 HTML 内容，绑定单击事件。
          
          2 在单击事件中，获取该小区的房源数据。
          3 展示房源列表。
          4 渲染获取到的房源数据。
  
          5 调用地图 panBy() 方法，移动地图到中间位置。
          6 监听地图 movestart 事件，在地图移动时隐藏房源列表。
        */
  
        this.getHousesList(id)
  
        // console.log('小区被点击了')
      })
  
      // 添加覆盖物到地图中
      this.map.addOverlay(label)
    }
    async getHousesList(id){
      Toast.loading('加载中。。。',0,null,false)
      const res = await axios.get(`http://localhost:8088/houses?cityId=${id}`)
      Toast.hide()
    // console.log('小区的房源数据:', res)
    this.setState({
      housesList: res.data.body.list,

      // 展示房源列表
      isShowList: true
    })
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
        return <div className={styles.map}>
            <NavHeader >
                地图找房
            </NavHeader>
            <div id="container"className={styles.container} ></div>
            <div
          className={[
            styles.houseList,
            this.state.isShowList ? styles.show : ''
          ].join(' ')}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <Link className={styles.titleMore} to="/home/list">
              更多房源
            </Link>
          </div>

          <div className={styles.houseItems}>
            {/* 房屋结构 */}
            {this.state.housesList.map(item => (
              <div className={styles.house} key={item.houseCode}>
                <div className={styles.imgWrap}>
                  <img
                    className={styles.img}
                    src={`http://localhost:8080${item.houseImg}`}
                    alt=""
                  />
                </div>
                <div className={styles.content}>
                  <h3 className={styles.title}>{item.title}</h3>
                  <div className={styles.desc}>{item.desc}</div>
                  <div>
                    {item.tags.map(tag => (
                      <span
                        className={[styles.tag, styles.tag1].join(' ')}
                        key={tag}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className={styles.price}>
                    <span className={styles.priceNum}>{item.price}</span> 元/月
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
    }
}