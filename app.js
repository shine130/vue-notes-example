const Editor = {
  props:[
    'entityObject'
  ],
  data(){
    return {
      entity:this.entityObject
    }
  },
  methods:{
    update(){
      this.$emit('update')
    }
  },
  template:`
    <div class="ui form">
      <div class="field">
        <textarea v-on:input="update" rows="5" v-model="entity.body" placeholder="写点东西..."></textarea>
      </div>
    </div>
  `
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
  computed:{
    header(){
      return _.truncate(this.entity.body,{length:30})
    },
    updated(){
      return moment(this.entity.meta.updated).fromNow()
    },
    words(){
      return this.entity.body.trim().length
    }
  },
  methods:{
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
  components:{
    'editor':Editor
  },
  template:`
    <div class="item">
      <div class="meta">
        {{updated}}
      </div>
      <div class="content">
        <div class="header" v-on:click="open = !open">{{header ||'新建笔记'}}</div>
        <div class="extra">
          <editor v-on:update="save" v-if="open" v-bind:entity-object="entity"></editor>
          {{words}}字
          <i class="right floated trash outline icon" v-if="open" v-on:click="destroy"></i>
        </div>
      </div>
    </div>
  `
}

const Notes = {
  data(){
    return {
      entities:[]
    }
  },
  created(){
    loadCollection('notes')
      .then(collection => {
        const _entities = collection.chain().find().simplesort('$loki','isdesc').data()
        this.entities = _entities
        console.log(this.entities)
      })
  },
  methods:{
    create(){
      loadCollection('notes').then(collection => {
        const entity = collection.insert({
          body:''
        })
        db.saveDatabase()
        this.entities.unshift(entity)
      })
    },
    destroy(id){
      const _entities = this.entities.filter((entity) => {
        return entity.$loki !== id
      })
      this.entities = _entities
      loadCollection('notes').then((collection) => {
        collection.remove({'$loki' : id})
        db.saveDatabase()
      })

    }
  },
  components:{
    'note':Note
  },
  template:`
    <div class="ui container notes">
      <h4 class="ui horizontal divider header">
        <i class="paw icon"></i>
        Notes App _ Vue.js
      </h4>
      <a v-on:click="create" class="ui right floated basic violet button">添加笔记</a>
      <div class="ui divided items">
        <note v-on:destroy="destroy" v-for="entity in entities" v-bind:entityObject="entity" v-bind:key="entity.$loki"></note>
        <span class="ui small disabled header" v-if="!this.entities.length">
          还没有笔记，请按下'添加笔记'按钮
        </span>
      </div>
    </div>
  `
}

const app = new Vue({
  el:'#app',
  components:{
    'notes':Notes
  },
  template:`
    <notes></notes>
  `
})