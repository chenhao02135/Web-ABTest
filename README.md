# Web-ABTest
前端简易ABTest组件,基于jquery和jquery.cookie;可以实现随机或根据用户ID进行ABTest分配;

##说明
1. 本组件是基于Jquery实现的简单版的ABTest组件; 
2. 每一项ABTest(options)必需有 分组名(grpName),测试用例列表(caseList)等属性;
对于每一条测试case,可以实现根据流量或者用户白名单进行分配;
3. chrome使用文件路径测试时,可能会出现不支持cookie的情况,可以尽量使用其他浏览器进行文件路径测试;
域名测试不受影响;
4. 调用方式: var res = $('body').abTest(options);  
返回对象为用例列表(caseList)中选中的一项;(组件会为返回项增加 caseName属性,值为对应的case名称)
5. 使用场景:  
   1-根据ABTest的case设置,调整到不同的URL地址;  
   2-某个Html页面,根据case设置,加载不同的模块;  
   3-某个Html页面,根据case设置,某模块加载不同的内容; 等  



