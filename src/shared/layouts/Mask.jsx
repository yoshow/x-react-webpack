import React from 'react';

// 遮罩的样式
var styleMaskWrapper = {
  position: "fixed",
  top: "0px",
  left: "0px",
  zIndex: 90,
  width: "100%",
  height: "100%",
  opacity: "0.4",
  background: "rgb(0, 0, 0)"
}

// 遮罩弹出窗口样式
var styleMaskPopupWindow = {
  width: "720px",
  height: "430px",
  zIndex: 800,
  position: "fixed",
  left: "440px",
  top: "40px"
}

class Mask extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = { name: props.name };

    this.name = props.name;
    // 封装器
    this.wrapperName = props.name + '-wrapper';
    this.popupWindowName = props.name + '-popupWindow';
  }

  /**
   * 组件加载完事件  
   */
  componentDidMount()
  {
    x.debug.log(this.refs.popupWindow);

    // 遮罩元素
    var wrapper = this.refs.wrapper;

    // var element = document.getElementById(this.popupWindowName);
    var element = this.refs.popupWindow;

    // 弹出窗口的位置
    // var pointX = this.options.left, pointY = this.options.top;
    var pointX = 0, pointY = 40;

    if (element === null)
    {
      element = document.createElement('div');

      element.id = this.popupWindowName;

      element.style.width = this.options.width;

      element.style.height = this.options.height;

      element.style.display = 'none';

      element.style.zIndex = x.ui.mask.zIndex++;

      $(document.body).append(element);

      $(element).fadeIn('normal');

      pointX = (x.page.getRange().width - $(element).width()) / 2;

      // 设置窗口的位置
      x.dom.fixed('#' + this.popupWindowName, pointX, pointY);
    }
    else
    {
      // element.style.zIndex = x.ui.mask.zIndex++;
      element.style.zIndex = 1000;

      // $(element).show();
      $(element).fadeIn('normal');

      pointX = (x.page.getRange().width - $(element).width()) / 2;

      x.dom.fixed('#' + this.popupWindowName, pointX, pointY);
    }
  }

  render()
  {
    return (
      <div id={this.name} >
        <div id={this.wrapperName} style={styleMaskWrapper} ref="wrapper"></div>
        <div id={this.popupWindowName} style={styleMaskPopupWindow}  ref="popupWindow">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Mask;