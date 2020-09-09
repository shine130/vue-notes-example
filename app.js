const Editor = {
  data(){
    return {
      entity:this.entityObject
    }
  },
  template:`
    <div class="ui form">
      <div class="field">
        <textarea v-model="entity.body" rows="5" placeholder="写点东西...">
        </textarea>
      </div>
    </div>
  `,
  props:['entityObject']
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
      <div class="content">
        <div class="header" @click="open = !open">{{entity.body || '新建笔记'}}</div>
        <div class="extra">
          <editor v-if="open" :entityObject="entity"></editor>
        </div>
      </div>
    </div>
  `,
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
        <note v-for="entity in entities" :entityObject="entity" :key="entity.$loki"></note>
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