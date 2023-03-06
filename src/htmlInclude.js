

var htmlInclude = 
{
  masterName:"include",
  reservedAttributes:["src","select","attribute", "include","html-include","cache","cached","fragment"],


  /**
   * Sets the query type , 
   * Gets include elements 
   * and processes them.
   * 
   * @param {string} mode Selector type to use:
   * - (default) "tag" if using <include> tag
   * - "attribute" if using "include" attribute
   */
  init: async function(mode = "tag")
  {

    let includeSelector
    
    if(mode == "attribute")
    {
      includeSelector = `[${this.masterName}]`
    }
    else if( mode == "tag")
    {
      includeSelector = this.masterName
    }
    else 
    {
      console.warn("A valid mode was not specified")
      return false
    }

    let includeElements = document.querySelectorAll(includeSelector)

    this.doIncludes(includeElements)


  },

  /**
   * Loops though all include elements and processes them
   * 
   * @param {HTMLCollection} includeElements 
   * @returns if include elements where found
   */
  doIncludes: function(includeElements)
  {
    if(includeElements)
    {

      for(let i = 0 ; i < includeElements.length ; i++)
      {
        this.doInclude(includeElements[i])
      }

      return true
    }
    return false
  },



  /**
   * Processes a single include element
   * 
   * @param {HTMLElement} includeElement 
   * @returns false = fail, true = processed
   */
  doInclude: async function(includeElement)
  {
    let translatedElement = await this.translate(includeElement)

      if(!translatedElement)
      {
        return false
      }

      let transformedElement = this.transform(translatedElement)

      if(!translatedElement)
      {
        return false;
      }

      this.replace(includeElement, transformedElement)
      return true
  },

  replace:function(element , template)
  {
    element.replaceWith(template)
  },

  transform: function( template)
  {
    let range = document.createRange()
    return range.createContextualFragment(template)
  },


  translate: async function(includeElement)
  {
    let props = this.getProps(includeElement)

    if(!includeElement.getAttribute("src"))
    {
      console.error("Include Element does not have a reference 'src' attribute")
      return false
    }

    let src = includeElement.getAttribute("src")

    let htmlTemplate = await this.getTemplate(src)

    /**
     * todo: 
     * retrieve html specified by "select" attribute from htmlTemplate function()
     */
    
    return this.includeProps(htmlTemplate, props)
  },

  /**
   * Gets HTML from url specified in 'src'
   * 
   * @param {string} src URL where to get HTML
   * @returns html string
   */
  getTemplate: async function(src)
  {

    return fetch(src)
    .then( res => 
      {
        if(!res.ok)
        {
          console.error("src '"+src+"' could not be found")
          return false
        }
        return res.text()
      })
    .then(templateResponse => 
      {
        return templateResponse
      })
    
  },

  includeProps: function(template, props)
  {
    let modifiedTemplate = template

    for(let prop in props)
    {
      modifiedTemplate = modifiedTemplate.replace(`$${prop}` , props[prop] )
    }

    return  modifiedTemplate;
  },

  getProps: function(element)
  {

    let props = {}
    Array.from(element.attributes).forEach(attribute => 
      {

          if(this.isReservedAttributes(attribute.name) == false)
          {
            props[attribute.name] = attribute.value
          }
      })

    return props
  },

  isReservedAttributes(attribute)
  {
    for(let reservedAttribute in this.reservedAttributes)
    {
      if(this.reservedAttributes[reservedAttribute] == attribute)
      {
        return true
      }
    }

    
    return false;
  }

}

htmlInclude.init("attribute")