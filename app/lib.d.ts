interface CodeMirror{
    
}
declare function CodeMirror(element:HTMLElement,options?:{
    value?:string,
    lineNumbers?:boolean,
    mode?:string
}):CodeMirror

interface Observable<T>{
    map<X>( mapFunction:(_:T) => X ): Observable<X>
}