export default {
  name: 'QuestionLabel',
  props: {
    dataModel: {
      required: true,
      type: Object
    },
    for: {
      required: true,
      type: String,
    },
    label: {
      required: true,
      type: String,
    },
  },
  render(createElement) {
    let dataModel = this.dataModel;
    const render  = {
      template: `<label for="${ this.for }">${ this.label }</label>`,
      data() { return { read: dataModel } },
    };

    return createElement(render);
  }
}
