const Note = {
  template:`
    <div class="item">
      <div class="content">
        <div class="header">{{entity.body}}</div>
      </div>
    </div>
  `,
  props:[
    'entityObject'
  ],
  data(){
    return {
      entity:this.entityObject
    }
  }
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
      <a class="ui right floated basic violet button" href="">添加笔记</a>
      <div class="ui divided items">
        <note v-for="entity in entities" :entityObject="entity" :key="entity.$loki"></note>
      </div>
    </div>
  `,
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