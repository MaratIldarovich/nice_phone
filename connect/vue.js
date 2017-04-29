Vue.directive('nice-phone', function (el, binding) {
  let {params} = binding.value;
  new NicePhone(params);
});
