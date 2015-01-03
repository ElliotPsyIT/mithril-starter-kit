'use strict';

var accordion = m.element('accordion', {
  controller: function() {
    this.toggle = function(id){
      this.open=id;
    };
  },
  view: function(ctrl, content) {
    return m('.accordian.panel.panel-default', content.map(function(line,id){
      var title=line.children[0],content=line.children[1];
      return [
        m(line,{
          class:'panel-heading',
          onclick:ctrl.toggle.bind(ctrl,id)
        },
        m('.panel-title',title)),
        m('div.panel-body',{style:'display:'+(ctrl.open===id? 'block':'none')},content)
      ];
    }));
  }
});


var jumbotron = m.element('jumbotron', {

  view: function(ctrl,inner) {
    return m('.jumbotron',[
      m('.container',[
        inner
      ])
    ]);
  }
});

var modal = m.element('modal', {

  controller: function(options) {
    var modal;
    function close(e){
      if (e) for (var t=e.target; t!=document.body;t=t.parentElement){
        if (t===modal) {
          return;
        }
      }
      options.trigger(false);
      document.body.removeEventListener('click', close);
      m.redraw();
    }
    this.state = options.trigger;
    this.trigger = {onclick:function(){close();}};
    this.bind = function(element,once){
      if (options.trigger()){
        modal=element;
        setTimeout(function(){
          document.body.addEventListener('click', close);
        });
      }
    };
  },

  view: function(ctrl,inner) {
    inner = inner();
    return m((ctrl.state()? 'div':'.modal.fade'), {config:ctrl.bind}, [
      m('.modal-dialog', [
        m('.modal-content', [
          m('.modal-header', [
            m('button.close[type="button" data-dismiss="modal" aria-label="Close"]',
              m('span[aria-hidden=true]', ctrl.trigger, m.trust('&times;'))),
            m('h4.modal-title', inner.title)
          ]),
          m('.modal-body', inner.body),
          m('.modal-footer', [
            m('button.btn.btn-default[type="button" data-dismiss="modal"]', ctrl.trigger, 'Close'),
            m('button.btn.btn-primary[type="button"]', ctrl.trigger, 'Save changes')
          ])
        ])
      ])
    ]);
  }
});

// tabset based on bootstrap navs markup.
// Options = 
//  active: current (default) tab
//  style: 'tabs' | 'pills'

var tabset = m.element('tabset', {

  controller: function(options){

    var currentTab = options.active;
    var count = 0;
    var tabs = this.tabs = [];
    var content = this.content = [];

    this.style=options.style || 'tabs';

    function Select(){
      currentTab = this.tabIdx;
    }

    function active(tabIdx) {
      return tabIdx===currentTab? 'active':'';
    }

    function display(tabIdx) {
      return {display: (tabIdx===currentTab? 'block':'none')};
    }

    m.element('tab', {
      controller: function(options){
        this.tabIdx=count++;
        this.href=function(){
          return options.href? {config: m.route,href:options.href}:{href:'#'};
        };
      },
      
      view: function(ctrl,inner) {
        var tabName=inner[0], tabContent=inner[1];
        tabs[ctrl.tabIdx] = m('li.tab', {onclick:Select.bind(ctrl),class:active(ctrl.tabIdx)}, m('a', ctrl.href(), tabName));
        content[ctrl.tabIdx] = m('.tabcontent', {style:display(ctrl.tabIdx)}, tabContent);
      }
    });

  },

  view: function(ctrl,tabs) {
    // tabs needs to be a factory in order to compile 
    // directly into ctrl (ie parent / child) context
    tabs();
    return m('.tabset',[
      m('ul.nav.nav-'+ctrl.style, ctrl.tabs),
      m('div',ctrl.content)
    ]);
  }

});

module.exports = {
  accordion:accordion,
  jumbotron:jumbotron,
  modal:modal,
  tabset:tabset
};