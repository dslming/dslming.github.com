module.exports = 'precision highp float;\n\nfloat normFloat(float n, float minVal, float maxVal){\n\treturn max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\nuniform vec3 cameraPosition;\nuniform mat4 modelMatrix;\nuniform mat4 viewMatrix;\nuniform mat4 projectionMatrix;\nuniform vec2 origin;\n\nattribute vec2 uv;\nattribute vec3 position;\n\nvarying vec2 vUv;\nvarying vec2 vOrigin;\n\nvoid main() {\n\tvUv = uv;\n\tvOrigin = origin * 0.1;\n \tvec4 realPos = modelMatrix * vec4(position, 1.0);\n\n\tgl_Position = projectionMatrix * viewMatrix * realPos;\n}';