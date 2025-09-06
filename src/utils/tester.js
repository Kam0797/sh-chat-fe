function themeHandler(theme=null, all=false) {
  console.log('blu',theme)

  const themes = [
    {
      name: 'Dark',
      code: 'dark',
      text: '#212122',
      bg: '#a1a3aa',
      accentColor: ''
    },
    {
      name: 'Light',
      code: 'light',
      text: '#a1a3aa',
      bg: '#212122',
      accentColor: ''
    },
    {
      name: 'Neurons',
      code: 'neurons',
      text: '#afd1ec',
      bg: '#224d5b',
      accentColor: ''
    },
    {
      name: 'System',
      code: '',
      text: '#888',
      bg: '#000',
      accentColor: ''
    }   
  ]
  const themesMap = new Map()
  themes.map(themeObj=> {
    themesMap.set(themeObj.code, themeObj)
  })
  if(all) {
    return themesMap;
  }
  const doc = document.querySelector('html');
  if(theme) {
    if(themesMap.has(theme)) {
    doc.dataset.theme = themesMap.get(theme).code
    }
    else {
      console.error('error:themeHandler:invalid theme', theme)
    }
  }
  console.info('hey',doc.dataset.theme)
  return doc.dataset.theme;
}

// test
console.log('WTF')
console.log('1',themeHandler())
console.log('2',themeHandler(undefined,true))
console.log('3',themeHandler('light'))
console.log('4',themeHandler('dark'))
console.log('5',themeHandler('ahole'))