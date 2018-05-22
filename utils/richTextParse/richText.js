function richTextParse(data) {
  //支持标签
  //	let nameArr = ['a','abbr','b','blockquote','br','code','col','colgroup','dd','del','div','dl','dt','em','fieldset','h1','h2','h3','h4','h5','h6','hr','i','img','ins','label','legend','li','ol','p','q','span','strong','sub','sup','table','tbody','td','tfoot','th','thead','tr','ul'];
  let nameArr = ['a', 'b', 'code', 'dd', 'div', 'dl', 'dt', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'i', 'img', 'label', 'li', 'ol', 'p', 'span', 'strong', 'sub', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul'];
  //最终结构树
  let tree = [];
  //初索引
  let index = 0;
  //匹配到的所有标签
  let tagArr = data.match(/<[^>]*>/gi);
  //记录标签索引位置
  let indexArr = [];
  //计算索引位置
  for (let i = 0; i < tagArr.length; i++) {
    //添加索引值
    indexArr.push(data.indexOf(tagArr[i]))
    //从字符数据中删除标签
    data = data.replace(tagArr[i], '')
  }

  //记录基本的信息值定义
  let cls, alt, src, width, height, step,href;

  let i = 0;
  //按标签个数进行循环
  while (i < tagArr.length - 1) {
    //获取基本信息
    tree[index] = sendInfoTree(i)
    index++;
  }
  console.log(tree)
  return tree;

  //将元素添加到tree中
  function sendInfoTree(idx) {
    getStartInfo(tagArr[idx])
    var label = tagArr[idx].match(/<*([^> ]*)/)[1];
    //第一级分支
    var obj = {
      name: checkName(label),
      attrs: {
        class: cls + ' rich-' + label
      },
      children: []
    }
    //相应的一些判断
    if (label === 'img') {
      //判断如果是img特殊标签
      obj.attrs['src'] = src;
      obj.attrs['alt'] = alt;
      obj.attrs['width'] = width;
      obj.attrs['height'] = height;
    } else if (step === 0) {
      //判断是否为单闭合标签（除img外的单闭合标签）-清空内容-方便处理
      obj.children.push({
        type: 'text',
        text: ''
      })
    } else if (tagArr[idx + 1] === '</' + label + '>') {
      //判断紧跟它的下一个标签是否为它的闭合标签
      let inStr = replaceStr(data.substring(indexArr[idx], indexArr[idx + 1]))
      if (inStr !== ''){
        obj.children.push({
          type: 'text',
          text: inStr
        })
      }
      //索引指向闭合标签
      i++;
    } else {
      //剩下的则可能这是个标签嵌套的一个标签
      //截取两个开始标签中间的内容
      if (indexArr[idx] !== indexArr[idx + 1]) {
        let inStr = replaceStr(data.substring(indexArr[idx], indexArr[idx + 1]));
        if (inStr !== ''){
          obj.children.push({
            type: 'text',
            text: inStr
          })
        }
      }
      //循环向下去找
      i++;
      while (i < tagArr.length - 1) {
        obj.children.push(sendInfoTree(i));
        //如果标签中间有文本（即索引不一致）
        if (indexArr[i - 1] !== indexArr[i]) {
          let inStr = replaceStr(data.substring(indexArr[i - 1], indexArr[i]));
          if (inStr !== ''){
            obj.children.push({
              type: 'text',
              text: inStr
            })
          }
        }
        //如果下一个是该结束的话则跳出
        if (tagArr[i] === '</' + label + '>') break;
      }
    }
    //如果是a标签的情况（没有跳转，将链接明文显示）
    if (label === 'a') {  
      obj.attrs['selectable'] = 'true'; 
      obj.children[obj.children.length - 1].text += '（' + href + '）';
    }
    i++;
    return obj;
  }

  //获取基本信息
  function getStartInfo(str) {
    //取得一些基本信息
    cls = matchRule(str, 'class');
    src = '';
    alt = '';
    width = '';
    height = '';
    //如果此标签为img标签
    if (str.match(/<*([^> ]*)/)[1] === 'img') {
      src = matchRule(str, 'src');
      alt = matchRule(str, 'alt');
      width = matchRule(str, 'width');
      height = matchRule(str, 'height');
    }else if (str.match(/<*([^> ]*)/)[1] === 'a') {
      href = matchRule(str, 'href');
    }
    //判断是否为单闭合标签
    step = str[str.length - 2] === '/' ? 0 : 1;
  }

  //获取部分属性的值
  function matchRule(str, rule) {
    let value = '';
    let re = new RegExp(rule + '=[\'"]?([^\'"]*)');
    if (str.match(re) !== null) {
      value = str.match(re)[1];
    }
    return value;
  }
  //检查是否为支持的标签
  function checkName(str) {
    let name = 'div';
    for (let i = 0; i < nameArr.length; i++){
      if (str === nameArr[i]) {
        name = str;
        break;
      }
    }
    return name;
  }
  // 清理头尾无用标签空格等
  function replaceStr(str) {
    return str.replace(/^\s+|\s+$/g, '');
  }
}

module.exports = {
  go: richTextParse
};