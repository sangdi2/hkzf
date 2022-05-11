import React from "react";
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile'
import axios from "axios";
import { WhiteSpace } from 'antd-mobile';
import Na1 from '../../assets/images/nav-1.png';
import Na2 from '../../assets/images/nav-2.png';
import Na3 from '../../assets/images/nav-3.png';
import Na4 from '../../assets/images/nav-4.png';
import './index.scss';

const navs=[
  {id:1,src:Na1,name:'整租',path:'/home/findhouse'},
  {id:2,src:Na2,name:'合租',path:'/home/findhouse'},
  {id:3,src:Na3,name:'地图找房',path:'/home/map'},
  {id:4,src:Na4,name:'去出租',path:'/home/chuzu'}
]
 class Index extends React.Component{
   
    state = {
        data: ['1', '2', '3'],
        imgHeight: 100,
        groups:[],
        news:[],
        localcityy:[]
      }
      componentDidMount() {
        // simulate img loading
        setTimeout(() => {
          this.setState({
            data: [
              'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fp0.itc.cn%2Fimages01%2F20201107%2F990c011fcd064baca770a23d138cf3a4.png&refer=http%3A%2F%2Fp0.itc.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654667130&t=fb70f509db3ac623f99b07eb9a05f8df',
              'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic2.zhimg.com%2Fv2-023f8f6460f433a0f45ef02e5cddc5e8_1440w.jpg%3Fsource%3D172ae18b&refer=http%3A%2F%2Fpic2.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654667130&t=2331c7686f74eb45978521034e70657a',
              'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg1.ceramicschina.com%2Fupload%2Fimages%2F2020-06-09%2F20200609101437274.jpg&refer=http%3A%2F%2Fimg1.ceramicschina.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654667130&t=a9446ed8671b0685315fe99fb17b867d'
                  ],
          });
        }, 100);
        this.getGroups()
        this.getNews()
        var myCity = new window.BMapGL.LocalCity();
         myCity.get(async res=>{
          const result = await axios.get(
            `http://localhost:8088/area/info?name=${res.name}`
          )
          this.setState({
            localcityy:result.data.body.label
          })
        }

        )
      }
      async getGroups() {
        const res = await axios.get('http://localhost:8088/home/groups', {
          params: {
            area: 'AREA%7C88cff55c-aaa4-e2e0'
          }
        })
    
        // console.log(res)
        this.setState({
          groups: res.data.body
        })
      }
      async getNews() {
        const res = await axios.get(
          'http://localhost:8088/home/news?area=AREA%7C88cff55c-aaa4-e2e0'
        )
    
        this.setState({
          news: res.data.body
        })
      }
      navv(){
        return navs.map(item => (
          <Flex.Item key={item.id} onClick={()=>this.props.history.push(item.path)}>
                 <img src={item.src} alt=""/>
                 <p>{item.name}</p>
          </Flex.Item>
        ))
      }
      renderNews() {
        return this.state.news.map(item => (
          <div className="news-item" key={item.id}>
            <div className="imgwrap">
              <img
                className="img"
                src={`http://localhost:8088${item.imgSrc}`}
                alt=""
              />
            </div>
            <Flex className="content" direction="column" justify="between">
              <h3 className="title">{item.title}</h3>
              <Flex className="info" justify="between">
                <span>{item.from}</span>
                <span>{item.date}</span>
              </Flex>
            </Flex>
          </div>
        ))
      }
    
     
      render() {
        return (
          <div className="index">
            <div className="swiper">
            <Carousel
              autoplay={true}
              infinite
              beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
              afterChange={index => console.log('slide to', index)}
            >
              {this.state.data.map(val => (
                <a
                  key={val}
                  href="http://www.alipay.com"
                  style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
                >
                  <img
                    src={val}
                    alt=""
                    style={{ width: '100%',height:'100%', verticalAlign: 'top' }}
                    onLoad={() => {
                      // fire window resize event to change height
                      window.dispatchEvent(new Event('resize'));
                      this.setState({ imgHeight: 'auto' });
                    }}
                  />
                </a>
              ))}
            </Carousel>
            <Flex className="search-box">
            {/* 左侧白色区域 */}
            <Flex className="search">
              {/* 位置 */}
              <div
                className="location"
                onClick={() => this.props.history.push('/citylist')}
              >
                <span className="name">{this.state.localcityy}</span>
                <i className="iconfont icon-arrow" />
              </div>

              {/* 搜索表单 */}
              <div
                className="form"
                onClick={() => this.props.history.push('/search')}
              >
                <i className="iconfont icon-seach" />
                <span className="text">请输入小区或地址</span>
              </div>
            </Flex>
            {/* 右侧地图图标 */}
            <i
              className="iconfont icon-map"
              onClick={() => this.props.history.push('/map')}
            />
          </Flex>
            </div>
            <Flex className="nav">
               
               {this.navv()}
            </Flex>
            <div className="group">
          <h3 className="group-title">
            租房小组 <span className="more">更多</span>
          </h3>

          {/* 宫格组件 */}
          <Grid
            data={this.state.groups}
            columnNum={2}
            square={false}
            hasLine={false}
            renderItem={item => (
              <Flex className="group-item" justify="around" key={item.id}>
                <div className="desc">
                  <p className="title">{item.title}</p>
                  <span className="info">{item.desc}</span>
                </div>
                <img src={`http://localhost:8088${item.imgSrc}`} alt="" />
              </Flex>
            )}
          />
        </div>
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>

          </div>
        );
      }
}
export default Index