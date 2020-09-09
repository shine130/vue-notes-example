const Editor = {
  data(){
    return {
      entity:this.entityObject
    }
  },
  template:`
    <div class="ui form">
      <div class="field">
        <textarea @input="update" v-model="entity.body" rows="5" placeholder="写点东西...">
        </textarea>
      </div>
    </div>
  `,
  props:['entityObject'],
  methods: {
    update(){
      this.$emit('update')
    }
  },
}

const Note = {
  props:[
    'entityObject'
  ],
  data(){
    return {
      entity:this.entityObject,
      open:false
    }
  },
  template:`
    <div class="item">
      <div class="meta">
        {{updated}}
      </div>
      <div class="content">
        <div class="header" @click="open = !open">{{header || '新建笔记'}}</div>
        <div class="extra">
          <editor @update="save" v-if="open" :entityObject="entity"></editor>
          {{words}} 字
          <i class="right floated trash icon" v-if="open" @click="destroy"></i>
        </div>
      </div>
    </div>
  `,
  methods: {
    save(){
      loadCollection('notes').then((collection) => {
        collection.update(this.entity)
        db.saveDatabase()
      })
    },
    destroy(){
      this.$emit('destroy',this.entity.$loki)
    }
  },
  computed: {
    header(){
      return _.truncate(this.entity.body,{length:30})
    },
    updated(){
      return moment(this.entity.meta.updated).fromNow();
    },
    words(){
      return this.entity.body.trim().length
    }
  },
  components:{Editor}
}

const Notes = {
  data(){
    return {
      entities:[]
    }
  },
  template:`
    <div class="ui container notes">
      <h4 class="ui horizontal divider header">
        <i class="paw icon"></i>
        Shine Notes App _Vue.js
      </h4>
      <a @click="create" class="ui right floated basic violet button" href="">添加笔记</a>
      <div class="ui divided items">
        <note v-for="entity in entities" :entityObject="entity" :key="entity.$loki" @destroy="destroy"></note>
        <span class="ui small disabled header" v-if="!this.entities.length">还没有笔记，请按下'添加笔记'按钮</span>
      </div>
    </div>
  `,
  methods: {
    create(){
      loadCollection('notes')
        .then((collection) => {
          const entity = collection.insert({
            body:''
          })
          db.saveDatabase();
          this.entities.unshift(entity)
        })
    },
    destroy(id){
      const _entities = this.entities.filter((entity) => {
        return entity.$loki !== id
      })

      this.entities = _entities;

      loadCollection('notes').then((collection) => {
        collection.remove({'$loki':id})
        db.saveDatabase()
      })


    }
  },
  created() {
    loadCollection('notes').then((collection) => {
      const _entities = collection.chain()
              .simplesort('$loki',true)
              .data();
              
      this.entities = _entities
      console.log(_entities)
    })
  },
  components:{Note}
}

const app = new Vue({
  el:'#app',
  components:{Notes},
  template:`
    <notes></notes>
  `
})