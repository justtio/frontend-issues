// webpack的核心原理

// webpack bundle的过程核心完成了内容转换与资源合并两种功能，包含以下三个阶段：
// 1.初始化阶段：
// 1.1 初始化参数：从配置文件、配置对象与Shell参数中读取与合并参数，得出最终的参数；
// 1.2 创建编译器对象：用上一步得到的参数初始化Compiler对象；
// 1.3 初始化编译环境：包含注入内置插件、注册各种模块工厂、初始化RuleSet集合、加载配置的插件等；
// 1.4 开始编译：调用Compiler对象的run方法开始编译；
// 1.5 确定入口：依据配置中的entry找出所有的入口文件，调用compilation.addEntry将入口文件转换为dependence对象；

// 2.构建阶段：
// 2.1 编译模块（make）：依据entry对应的dependence创建module对象，调用loader将模块转译为标准JS内容，调用JS解释器将内容转换为AST对象，
// 从中找出该模块依赖的模块，在递归的编译模块，直到所有入口依赖的文件都经过了编译；
// 2.2 完成模块编译：得到所有模块编译后的内容与模块之间的依赖关系；

// 3.生成阶段：
// 3.1 输出资源（seal): 依据入口和模块之间的依赖关系，组装成一个个包含多个模块的chunk，再把每个chunk转换成一个单独的文件加入到输出列表；（这一步是可以修改输出内容的最后机会）
// 3.2 写入文件系统（emitAssets): 在确定好输出内容后，依据配置确定输出的路径与文件名，把文件内容写入到文件系统中；