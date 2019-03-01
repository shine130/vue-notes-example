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
    }
  },
  components:{
    'editor':Editor
  },
  template:`
    <div class="item">
      <div class="content">
        <div class="header" v-on:click="open = !open">{{header ||'新建笔记'}}</div>
        <div class="extra">
          <editor v-if="open" v-bind:entity-object="entity"></editor>
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
        <note v-for="entity in entities" v-bind:entityObject="entity" v-bind:key="entity.$loki"></note>
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