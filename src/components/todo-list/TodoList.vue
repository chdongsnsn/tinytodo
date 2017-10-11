<template>
  <el-row class="content">
    <el-col :xs="{span:20,offset:2}" :sm="{span:8,offset:8}">
      <span>
        欢迎：{{name}}！你的待办事项是：
      </span>
      <el-input
        placeholder="还有什么要做的呢..."
        v-model="todos"
        @keyup.enter.native="addTodos">
        <el-button
          slot="append"
          icon="edit"
          @click="addTodos">
        </el-button>
      </el-input>
      <el-tabs v-model="activeName">
        <el-tab-pane label="待办事项" name="first">
          <el-col :xs="24">
            <template v-if="!Done"> <!--v-if和v-for不能同时在一个元素内使用，因为Vue总会先执行v-for-->
              <template v-for="(item, index) in list">
                <div class="todo-list" v-if="item.status == false">
                  <span class="item">
                    <i class="iconfont el-icon-time"></i> {{ item.content }}
                  </span>
                  <span class="pull-right">
                    <el-button size="small" type="primary" @click="updateTodo(index)">完成</el-button>
                    <el-button size="small" :plain="true" type="danger" @click="remove(index)">删除</el-button>
                  </span>
                </div>
              </template>
            </template>
            <div v-else-if="Done">
              暂无待办事项
            </div>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="已完成事项" name="second">
          <template v-if="count > 0">
            <template v-for="(item, index) in list">
              <div class="todo-list" v-if="item.status == true">
                <span class="item finished">
                  <i class="iconfont el-icon-check"></i> {{ item.content }}
                </span>
                <span class="pull-right">
                  <el-button size="small" type="primary" @click="updateTodo(index)">还原</el-button>
                </span>
              </div>
            </template>
          </template>
          <div v-else>
            暂无已完成事项
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script>
  import bus from '@/assets/eventBus';

  export default {
    async created() {
      const { data } = await this.getUserInfo();
      if (data) {
        this.name = data.username;
        this.getTodos();
      }
      bus.$emit('pageChange', this.$route.path);
    },
    data() {
      return {
        name: '',
        todos: '',
        activeName: 'first',
        list: [],
        count: 0,
      };
    },
    computed: {
      Done() {
        let count = 0;
        const list = this.list;
        const length = this.list.length;
        for (let i = 0; i < length; i += 1) {
          if (list[i].status === true) {
            count += 1;
          }
        }
        this.count = count;
        if (count === length || length === 0) {
          return true;
        }
        return false;
      },
    },
    methods: {
      addTodos() {
        if (this.todos === '') return;
        const todo = {
          status: false,
          content: this.todos,
        };
        this.$http.post('/api/todo', todo)
          .then((res) => {
            if (res.data.success) {
              this.$message({
                type: 'success',
                message: '创建成功！',
              });
              this.getTodos();
            } else {
              this.$message.error('服务器开小差了...');
            }
          }, (err) => {
            this.$message.error('您的网络似乎有些问题...');
            console.log(err);
          });
        this.todos = '';
      },
      updateTodo(index) {
        /* eslint-disable */
        const id = this.list[index]._id;
        const status = this.list[index].status;
        this.$http.patch('/api/todo', { id, status })
          .then((res) => {
            if (res.data.success) {
              if (!status) {
                this.$message({
                  type: 'success',
                  message: '恭喜你又消灭一项😳',
                });
              }
              this.getTodos();
            } else {
              this.$message.error(res.data.msg);
            }
          });
      },
      remove(index) {
        this.$confirm('删除的项目不可被恢复，确认删除？', '小心啦', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          const id = this.list[index]._id;
          this.$http.delete(`/api/todo/${id}`)
            .then((res) => {
              if (res.data.success) {
                this.$message({
                  type: 'info',
                  message: '任务删除成功',
                });
                this.getTodos();
              } else {
                this.$message.error(res.data.msg);
              }
            }, (err) => {
              console.log(err);
            });
        }).catch(() => {
          return false;
        })
      },
      /* eslint-enable */
      async getUserInfo() {
        try {
          const userInfo = await this.$http.get('/api/user/getUserInfo');
          return userInfo;
        } catch (error) {
          if (error.message.includes('401')) {
            this.$message.error('用户信息已过期，请重新登录');
            this.$router.push('/');
          }
          return false;
        }
      },
      async getTodos() {
        try {
          const res = await this.$http.get('/api/todo');
          if (res.data.success) {
            this.list = res.data.todos;
          } else {
            this.$message.error(res.data.msg);
            this.list = [];
          }
        } catch (err) {
          this.$message.error('您的网络似乎有些问题...');
          this.list = [];
        }
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "TodoList.scss";
</style>
