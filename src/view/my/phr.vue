<template>
	<div class="main">
		<div class="head-bar">
			<span @click="goBack"><Icon  type="ios-arrow-back"/>返回</span>
			<!--<span>预览</span>-->
		</div>
		<h1>健康档案</h1>
		<!--<span v-if="healthId">档案号：{{healthId}}</span>-->
		<div class="content">
			<Form :rules="rules"  :model="healthData" ref="healthDataForm">
				<div class="body-one">
					<div class="content-card">
						<FormItem  prop="sourceOfReferral" label="转介来源：">
							<Select v-model="healthData.sourceOfReferral" placeholder="转介来源">
								<Option :value="item.id" :key="item.id"  v-for="item in sourceList">{{item.itemName}}
								</Option>
							</Select>
						</FormItem>
						<FormItem  prop="subordinateArea" label="隶属区域：">
							<Select class="subordinateArea" v-model="healthData.subordinateArea" >
								<Option v-for="(item,index) in suboAreaList" :value="item.itemName" :key="index">{{ item.itemName }}</Option>
							</Select>
						</FormItem>
						<FormItem  prop="living" label="居住方式：">
							<Select class="living" v-model="healthData.living" >
								<Option v-for="(item,index) in liveList" :value="item.key" :key="index">{{ item.living }}</Option>
							</Select>
						</FormItem>
					</div>
					<div class="content-card">
						<div class="ng-box">
							<div @click="openMyData('name')">
								<FormItem  prop="name" label="姓名：">
									<Input class="name"  v-model="healthData.name" placeholder="请输入姓名" disabled  />
								</FormItem>
							</div>
							<div @click="openMyData('gender')">
								<FormItem label="性别：" prop="gender">
									<Select  v-model="healthData.gender" placeholder="请选择性别" disabled  >
										<Option v-for="item in gender" :value="item.key" :key="item.key">{{item.sex}}</Option>
									</Select>
								</FormItem>
							</div>
						</div>
						<div @click="">
							<FormItem  prop="birthday" label="出生年月：">
								<div @click="showPopFn" class="birthday-box">
									<Input class="birthday"  v-model="healthData.birthday" placeholder="出生年月" disabled/>
									<span>年龄:{{healthData.age?healthData.age:0}}</span>
								</div>
							</FormItem>
						</div>
						<FormItem  prop="educationLevel" label="文化：">
							<Select class="educationLevel" v-model="healthData.educationLevel">
								<Option v-for="item in educationLevel" :value="item.key" :key="item.key">{{ item.Level }}</Option>
							</Select>
						</FormItem>
						<FormItem  prop="nativePlace" label="籍贯：">
							<Select class="nativePlace" v-model="healthData.nativePlace">
								<Option v-for="item in nativePlace" :value="item.name" :key="item.id">{{ item.name }}</Option>
							</Select>
						</FormItem>
						<FormItem  prop="nationality" label="民族：">
							<Select class="nationality" v-model="healthData.nationality">
								<Option v-for="item in nationality" :value="item.name" :key="item.id">{{ item.name }}</Option>
							</Select>
						</FormItem>
						<FormItem  prop="occupation" label="职业：">
							<Input class="occupation" v-model="healthData.occupation" placeholder="输入职业"  />
						</FormItem>
						<FormItem  prop="maritalStatus" label="婚姻状况：">
							<Select class="maritalStatus" v-model="healthData.maritalStatus">
								<Option v-for="item in maritalStatus" :value="item.key" :key="item.key">{{ item.maritalStatus }}</Option>
							</Select>
						</FormItem>
						<FormItem  prop="medicalPaymentMethod" label="医疗付款方式：">
							<Select class="medicalPaymentMethod" v-model="healthData.medicalPaymentMethod">
								<Option v-for="item in payList" :value="item.id" :key="item.id">{{ item.itemName }}</Option>
							</Select>
						</FormItem>
						<FormItem  prop="residence" label="现居住地：">
							<Select v-model="healthData.residence">
								<Option v-for="item in resiList" :value="item.itemName" :key="item.value">{{ item.itemName }}</Option>
							</Select>
						</FormItem>
						<FormItem  prop="workplace" label="工作单位：">
							<Input class="workplace" type="textarea" :rows="3" v-model="healthData.workplace" placeholder="工作单位"  />
						</FormItem>
						<FormItem  prop="workplaceContact" label="单位联系人：">
							<Input class="workplaceContact" v-model="healthData.workplaceContact" placeholder="单位联系人" :maxlength="8" />
						</FormItem>
						<FormItem  prop="workplaceContactPhone" label="单位联系电话：">
							<Input class="workplaceContactPhone" v-model="healthData.workplaceContactPhone" placeholder="单位联系电话"  :maxlength="13"/>
						</FormItem>
					</div>
					<div class="content-card" style="border: none">
						<FormItem  prop="residenceAddress" label="住所地址：">
							<Input type="textarea" :rows="3" class="residenceAddress" v-model="healthData.residenceAddress" placeholder="住所地址"  />
						</FormItem>
						<FormItem  prop="residenceContact" label="住所联系人：">
							<Input class="residenceContact" v-model="healthData.residenceContact" placeholder="住所联系人"  :maxlength="8"/>
						</FormItem>
						<FormItem  prop="relation" label="关系：">
							<Select class="relation" v-model="healthData.relation">
								<Option v-for="item in relation" :value="item.key" :key="item.key">{{ item.relation }}</Option>
							</Select>
						</FormItem>
						<FormItem  prop="residenceContactPhone" label="联系人电话：">
							<Input class="residenceContactPhone"  v-model="healthData.residenceContactPhone" placeholder="联系人电话"  :maxlength="13"/>
						</FormItem>
					</div>
				</div>
				<div class="line"></div>
				<div class="body-two">
					<h2>基本健康状况：</h2>
					<FormItem  prop="cerebralApoplexyFactor" label="">
						<h4><span class="tip">1</span>心脑血管疾病风险筛查<span>(多选)</span>：</h4>
						<CheckboxGroup class="cerebralApoplexyFactor" v-model="healthData.cerebralApoplexyFactor">
							<Checkbox v-for="(item,index) in cerebralApoplexyFactorList" :key="index" :label="item" >
								<span>{{item}}</span>
							</Checkbox>
						</CheckboxGroup>
					</FormItem>
					<div class="xuezhi mmHg">
						<h4><span class="tip">2</span>当前血压水平(mmHg)</h4>
						<div style="display: flex;justify-content: space-between">
							<FormItem  prop="diastolicBloodPressur" label="舒张压(mmHg)" style="display: flex;margin: 0">
								<Input  class="diastolicBloodPressur" :maxlength="4"  v-model="healthData.diastolicBloodPressur" placeholder=""  />
							</FormItem>
							<FormItem  prop="systolicBloodPressur" label="收缩压(mmHg)" style="display: flex;margin: 0">
								<Input class="systolicBloodPressur"  :maxlength="4" v-model="healthData.systolicBloodPressur" placeholder=""  />
							</FormItem>
						</div>
						<FormItem  prop="takeAntihypertensiveDrugs" label="正在服用降压药：">
							<Radio-group v-model="healthData.takeAntihypertensiveDrugs">
								<Radio v-for="item in radio" :label="item.label" :key="item.label">{{item.name}}</Radio>
							</Radio-group>
						</FormItem>
					</div>
					<FormItem  prop="diabetesMellitus" label=" ">
						<h4><span class="tip">3</span>糖尿病
							<RadioGroup class="diabetesMellitus" v-model="healthData.diabetesMellitus">
								<Radio v-for="item in radio" :label="item.label" :key="item.label">{{item.name}}</Radio>
							</RadioGroup>
						</h4>
					</FormItem>

					<FormItem class="xuezhi sc" label="">
						<h4><span class="tip">4</span>血脂水平</h4>
						<FormItem  prop="triglyceride" label="甘油三脂(TC)">
							<Input class="triglyceride" style="width: 100px" type="number"  v-model="healthData.triglyceride" placeholder=""  />
							<span>mmol/1</span>
						</FormItem>
						<FormItem  prop="highDensityLipteinCholesterol" label="高密度脂蛋白胆固醇(HDL-C)">
							<Input class="highDensityLipteinCholesterol" style="width: 100px" type="number" :maxlength="5" v-model="healthData.highDensityLipteinCholesterol" placeholder=""  />
							<span>mmol/1</span>
						</FormItem>
						<FormItem  prop="lowDensityLipteinCholesterol" label="低密度脂蛋白胆固醇(LDL-C)">
							<Input class="lowDensityLipteinCholesterol" style="width: 100px" type="number" :maxlength="5" v-model="healthData.lowDensityLipteinCholesterol" placeholder=""  />
							<span>mmol/1</span>
						</FormItem>
					</FormItem>

					<FormItem class="xuezhi"  prop="littlePhysicalExercise" label=" ">
						<h4><span class="tip">5</span>体育锻炼很少或轻体力劳动者</h4>
						<div >
							<RadioGroup class="littlePhysicalExercise" v-model="healthData.littlePhysicalExercise">
								<Radio v-for="item in radio" :label="item.label" :key="item.label">{{item.name}}</Radio>
							</RadioGroup>
						</div>
						<div>
							<p class="explain">{{explain[0]}}</p>
						</div>
					</FormItem>
					<div class="hg">
						<span class="tip">6</span>
						<FormItem  prop="height" label=" 身高" style="display:flex;margin-right:0.5rem;border: none">
							<Input class="height"  style="width: 70px" type="number" :maxlength="6" v-model="healthData.height" placeholder=""  @on-blur="validateNum('身高')"/>
							<span>M</span>
						</FormItem>
						<FormItem  prop="weight" label=" 体重" style="display:flex;border: none" >
							<Input class="weight"  style="width: 70px" type="number" :maxlength="6" v-model="healthData.weight" placeholder=""  @on-blur="validateNum('体重')"/>
							<span>kg</span>
						</FormItem>
					</div>
					<FormItem  prop="smokingStatus" label=" ">
						<h4><span class="tip">7</span>现在是否吸烟</h4>
						<div >
							<RadioGroup class="smokingStatus" v-model="healthData.smokingStatus">
								<Radio v-for="item in radio" :label="item.label" :key="item.label">{{item.name}}</Radio>
							</RadioGroup>
						</div>
						<div v-if="healthData.smokingStatus">
							<span>每天吸烟≥30支</span>
							<RadioGroup class="heavySmoking" v-model="healthData.heavySmoking">
								<Radio v-for="item in radio" :label="item.label" :key="item.label">{{item.name}}</Radio>
							</RadioGroup>
						</div>
					</FormItem>
					<FormItem  prop="hereditaryDisease" label=" ">
						<h4><span class="tip">8</span>心脑血管疾病家族史</h4>
							<Radio-group class="hereditaryDisease" v-model="healthData.hereditaryDisease">
								<Radio v-for="item in radio" :label="item.label" :key="item.label">{{item.name}}</Radio>
							</Radio-group>
						<div>
							<p class="explain">{{explain[2]}}</p>
						</div>
					</FormItem>
				</div>
			</Form>
		</div>
		<div  v-if="isEdit" class="btn" @click="saveData">保存修改</div>
		<div v-else class="btn" @click="saveData">保存</div>
		<van-popup v-model="show" position="bottom" :style="{ height: '40%' }">
			<van-datetime-picker
					v-model="currentDate"
					type="date"
					:min-date="minDate"
					:max-date="maxDate"
					:formatter="formatter"
					@confirm="confirmFn()"
					@cancel="cancelFn()"
			/>
		</van-popup>
	</div>
</template>

<script>
	import {getNation, getDistrict, getProvince,getSourceList,getPayList,getResidenceList,addHealthRecord,getHealthRecordList,editHealthRecord} from "@/lib/API/comment";
	import { MessageBox,Indicator  } from 'mint-ui';
	import {getUserDate} from "@/lib/API/login-enroll";
	export default {
		// beforeRouteLeave (to, from, next) {
		// 	MessageBox.confirm('是否放弃修改？').then(action => {
		// 		if(action==='confirm'){
		// 			this.$router.back();//返回上一层
		// 			next()
		// 		}
		// 	}).catch(() => {
		// 		next(false)
		// 	})
		// },
		data() {
			var checkPhone = (rule,value,callback) => {
				let mobile = /^[1]([3-9])[0-9]{9}$/
				let tel = /^0(\d{2,3}|\d{2,3}-|)?\d{7,8}$/
				if(value===''||value===null||value===undefined){
					callback()
				}
				if (!tel.test(value) && !mobile.test(value)){
					return callback(new Error('号码格式错误'))
				}else {
					callback()
				}
			}
			return {
				rules: {
					sourceOfReferral:[{required: true, message: '请选择转介来源', trigger: 'change',type:'number'}],
					living:[{required: true, message: '请选居住方式', trigger: 'change',type:'number'}],
					subordinateArea:[{required: true, message: '请选隶属区域', trigger: 'change'}],
					name:[{required: true, message: '姓名不能为空', trigger: 'blur'}],
					gender:[{required: true, message: '请选择性别', trigger: 'blur',type:'number'}],
					birthday:[{required: true, message: '出生日期不能为空', trigger: 'blur'}],
					educationLevel:[{required: true, message: '请选择文化水平', trigger: 'change',type:'number'}],
					maritalStatus:[{required: true, message: '请选择婚姻状况', trigger: 'change',type:'number'}],
					medicalPaymentMethod :[{required: true, message: '请选择医疗支付方式', trigger: 'change',type:'number'}],
					workplaceContactPhone :[
						{ message: '单位联系人号码格式错误',trigger: 'blur，change', validator:checkPhone },
						// { pattern: /^[1]([3-9])[0-9]{9}$/, message: '单位联系人号码格式错误', trigger: 'blur' }
					], //非必填
					residenceContactPhone :[
						{message: '住址联系号码格式错误', trigger: 'blur，change',validator:checkPhone},
					], //非必填
					residenceAddress  :[{required: true, message: '住所地址不能为空', trigger: 'blur'}],
					// 病情筛选
					diabetesMellitus  :[{required: true, message: '请选择是否糖尿病', trigger: 'change',type:'number'}],
					smokingStatus   :[{required: true, message: '请选择是否吸烟', trigger: 'change',type:'number'}],
					hereditaryDisease :[{required: true, message: '请选择是否有心脑血管家族遗传病史', trigger: 'change',type:'number'}],
					takeAntihypertensiveDrugs  :[{required: true, message: '请选择是否正在服用降压药',trigger: 'change',type:'number'}],
					littlePhysicalExercise   :[{required: true, message: '请选择体育锻炼情况',trigger: 'change',type:'number'}],
					height :[{required: true, message: '身高不能为空'},
						{ pattern: /\d+(\.\d{0,2})?/, message: '请输入正确的身高', trigger: 'blur' }
						],
					weight :[{required: true, message: '体重不能为空'},
						{ pattern: /\d+(\.\d{0,2})?/, message: '请输入正确的体重', trigger: 'blur' }
						],
					diastolicBloodPressur:[{ pattern: /(^[1-9]\d*$)/, message: '只能为正整数,最多4位数', trigger: 'blur' }], //舒张压
					systolicBloodPressur:[{ pattern: /(^[1-9]\d*$)/, message: '只能为正整数,最多4位数', trigger: 'blur'}],  // 收缩压
					// triglyceride:[{ pattern: /\d+(\.\d{0,2})?/, message: '只能为小于32767数字', trigger: 'blur' }],  // 甘油三脂(TC)
					// highDensityLipteinCholesterol:[{ pattern: /\d+(\.\d{0,2})?/, message: '只能为小于32767数字', trigger: 'blur' }],  // 高密度脂蛋白胆固醇
					// lowDensityLipteinCholesterol:[{ pattern: /\d+(\.\d{0,2})?/, message: '只能为小于32767数字', trigger: 'blur' }],  // 低密度脂蛋白胆固醇
				},
				healthId:'', //用户档案ID
				minDate: new Date(1900,0,1),
				maxDate: new Date(),
				currentDate: new Date(1950,0,1),
				show:false,
				isEdit:false,
				birthday:'', //生日
				living:'', //选中的居住方式
				sourceList:[], //转介来源
				liveList:[
					{
						living:'独居',
						key:0
					},
					{
						living:'只与配偶同住',
						key:1
					},
					{
						living:'与家人同住',
						key:2
					},
				],
				suboAreaList:[],
				// 性别
				gender:[
					{
						sex:'男',
						key:1
					},
					{
						sex:'女',
						key:2
					},
				],
				// 学历
				educationLevel:[
					{
						Level:'小学',
						key:1
					},
					{
						Level:'初中',
						key:2
					},
					{
						Level:'中专',
						key:3
					},
					{
						Level:'大专',
						key:4
					},
					{
						Level:'大学本科',
						key:5
					},
					{
						Level:'研究生',
						key:6
					},
					{
						Level:'研究生以上',
						key:7
					},
				],
				// 用户关系
				relation:[
					{
						relation:'夫妻',
						key:1
					},
					{
						relation:'子女',
						key:2
					},
					{
						relation:'亲属',
						key:3
					},
					{
						relation:'陪人',
						key:4
					},
					{
						relation:'保姆',
						key:5
					},
				],
				// 婚姻状况
				maritalStatus:[
					{
						maritalStatus:'未婚',
						key:0
					},
					{
						maritalStatus:'已婚',
						key:1
					},
					{
						maritalStatus:'离异',
						key:2
					},
					{
						maritalStatus:'丧偶',
						key:3
					},
				],
				// 医疗付款方式列表
				payList:[],
				// 现居住地
				resiList:[],
				// 籍贯
				nativePlace:[],
				// 民族
				nationality:[],
				healthData:{
					birthday:null,
					name:null,
				},
				// 脑卒中因素
				cerebralApoplexyFactorList:['既往有脑卒中','既往有短暂性脑缺血发作','冠心病'],
				radio:[
					{label: 0, name: '否'},
					{label: 1, name: '是'},
				],
				// 内容说明
				explain:[
					'（次数<3次/周且<30分钟/次：经常参与工农业劳动视为有体育锻炼）',
					'（BMI：12kg/m2）',
					'（指父母、兄弟姐妹中有人患有心肌梗死或脑卒中）'
				],
			}
		},
		created(){
			this.userId = localStorage.getItem('userId')
			this.init()
			this.getHealthRecordList()

		},
		mounted(){
			window.addEventListener('resize',()=> {
				if(document.activeElement.tagName === 'INPUT'){
					document.activeElement.scrollIntoViewIfNeeded()
				}
			})
			setTimeout(()=>{
				this.getUserDate({userId:this.userId})
			},300)
		},
		methods: {
			//初始化，获取数据
			init(){
				this.getNation() // 民族
				this.getDistrict() // 隶属区域
				this.getProvince()// 籍贯
				this.getSourceList()// 转介来源
				this.getPayList()// 医疗付款方式
				this.getResidenceList()// 现居住地列表
				this.getDay(0,'-') //当前时间
			},
			//完善个人信息
			openMyData(type){
				if(type==='name'&&!this.healthData.name){
					MessageBox.confirm('您的个人中心尚未完善，是否现在完善？').then(action => {
						if(action==='confirm'){
							this.$router.push({name:'个人信息'})
						}
					}).catch(() => {
						console.log('取消');
					})
				}else if(type==='birthday'&&!this.healthData.birthday){
					MessageBox.confirm('您的个人中心尚未完善，是否现在完善？').then(action => {
						if(action==='confirm'){
							this.$router.push({name:'个人信息'})
						}
					}).catch(() => {
						console.log('取消');
					})
				}else {
					MessageBox.confirm('此信息需前往个人中心修改，现在去修改').then(action => {
						if(action==='confirm'){
							this.$router.push({name:'个人信息'})
						}
					}).catch(() => {
						console.log('取消');
					})
					// this.$toast('请前往个人中心修改此信息')
				}
			},
			saveData(){
				this.$refs.healthDataForm.validate(async (valid) => { // 表单校验
					if (valid) {
						console.log('验证通过');
						if(this.isEdit){
							this.editHealthRecord()
						}else {
							this.addHealthRecord()
						}
					} else {
						// this.$Message.error('请正确填写表单')
						this.$toast('请正确填写表单')
					}
				})
			},
			//用户健康档案列表
			async getHealthRecordList(){
				Indicator.open('加载中...')
				let params = {
					userId:this.userId
				}
				let res = await getHealthRecordList(params)
				if(res.code === 200){
					Indicator.close()
					if(res.data.list.length>0){  //有健康档案
						console.log('有健康档案')
						this.isEdit = true
						this.healthData=res.data.list[0]
						for(let i in this.healthData){
							if(this.healthData[i]==='null')
								this.healthData[i]=null
						}
						this.getAge()
						this.healthId = this.healthData.id
						if(this.healthData.cerebralApoplexyFactor){
							this.healthData.cerebralApoplexyFactor = this.healthData.cerebralApoplexyFactor.split(',')
						}else {
							this.healthData.cerebralApoplexyFactor = []
						}
						if(this.healthData.systolicBloodPressur===0){
							this.healthData.systolicBloodPressur = ''
						}
						if(this.healthData.diastolicBloodPressur===0){
							this.healthData.diastolicBloodPressur = ''
						}
						if(this.healthData.triglyceride===0){
							this.healthData.triglyceride = ''
						}
						if(this.healthData.highDensityLipteinCholesterol===0){
							this.healthData.highDensityLipteinCholesterol = ''
						}
						if(this.healthData.lowDensityLipteinCholesterol===0){
							this.healthData.lowDensityLipteinCholesterol = ''
						}
					}else {
						console.log('无健康档案')
						// this.getUserDate({userId:this.userId})
					}
				}else {
					Indicator.close()
				}
				console.log(this.isEdit);
			},
			//编辑健康档案
			async editHealthRecord(){
				let params = {
					// 必填项
					id:this.healthData.id,
					userId:this.userId,
					name :this.healthData.name,
					gender:this.healthData.gender ,
					living:this.healthData.living ,
					birthday:this.healthData.birthday ,
					educationLevel:this.healthData.educationLevel ,
					residenceAddress:this.healthData.residenceAddress,
					sourceOfReferral:this.healthData.sourceOfReferral ,
					subordinateArea:this.healthData.subordinateArea  ,
					maritalStatus:this.healthData.maritalStatus,
					medicalPaymentMethod:this.healthData.medicalPaymentMethod,
					smokingStatus:this.healthData.smokingStatus,
					hereditaryDisease:this.healthData.hereditaryDisease,
					takeAntihypertensiveDrugs :this.healthData.takeAntihypertensiveDrugs,
					diabetesMellitus :this.healthData.diabetesMellitus,
					littlePhysicalExercise:this.healthData.littlePhysicalExercise,
					height:this.healthData.height,
					weight :this.healthData.weight ,
				}
				// 非必填
				if(this.healthData.relation ){
					params.relation = this.healthData.relation
				}
				if(this.healthData.residence){
					params.residence = this.healthData.residence
				}
				if(this.healthData.residenceContact){ //住所联系人
					params.residenceContact = this.healthData.residenceContact
				}else {
					params.residenceContact = null
				}
				if(this.healthData.residenceContactPhone){ //住所联系人电话
					params.residenceContactPhone = this.healthData.residenceContactPhone
				}else {
					params.residenceContactPhone=null
				}
				if(this.healthData.workplace){ //工作地址
					params.workplace = this.healthData.workplace
				}else {
					params.workplace = null
				}
				if(this.healthData.workplaceContact){ //单位联系人
					params.workplaceContact = this.healthData.workplaceContact
				}else {
					params.workplaceContact=null
				}
				if(this.healthData.workplaceContactPhone){ //单位联系电话
					params.workplaceContactPhone = this.healthData.workplaceContactPhone
				}else {
					params.workplaceContactPhone = null
				}
				if(this.healthData.nativePlace){ //籍贯
					params.nativePlace = this.healthData.nativePlace
				}
				if(this.healthData.nationality){ //民族
					params.nationality = this.healthData.nationality
				}
				if(this.healthData.occupation){ //职业
					params.occupation = this.healthData.occupation
				}else {
					params.occupation = null
				}
				// 心脑血管疾病风险筛查编辑：
				if(this.healthData.cerebralApoplexyFactor&&this.healthData.cerebralApoplexyFactor!==''&&this.healthData.cerebralApoplexyFactor.length!==0){
					params.cerebralApoplexyFactor = this.healthData.cerebralApoplexyFactor.toString()
				}else {
					params.cerebralApoplexyFactor = null
				}
				console.log(this.healthData.cerebralApoplexyFactor);
				if(this.healthData.systolicBloodPressur){   //收缩压(mmHg)
					params.systolicBloodPressur = this.healthData.systolicBloodPressur
				}else {
					params.systolicBloodPressur =0
				}
				if(this.healthData.diastolicBloodPressur){ //舒张压(mmHg)
					params.diastolicBloodPressur=this.healthData.diastolicBloodPressur
				}else {
					params.diastolicBloodPressur = 0
				}
				if(this.healthData.triglyceride){ //甘油三酯含量(TC)
					if(this.healthData.triglyceride>=1000){
						this.healthData.triglyceride =''
						this.$toast('请输入正确的甘油三酯含量，列如：1.56')
						return
					}
					params.triglyceride=this.healthData.triglyceride
				}else {
					params.triglyceride = 0
				}
				if(this.healthData.highDensityLipteinCholesterol){ //高密度脂蛋白胆固醇(HDL-C)
					if(this.healthData.highDensityLipteinCholesterol>=1000){
						this.healthData.highDensityLipteinCholesterol =''
						this.$toast('请输入正确的高密度脂蛋白胆固醇，列如：1.56')
						return
					}
					params.highDensityLipteinCholesterol=this.healthData.highDensityLipteinCholesterol
				}else {
					params.highDensityLipteinCholesterol =0
				}
				if(this.healthData.lowDensityLipteinCholesterol){ //低密度脂蛋白胆固醇(LDL-C)
					if(this.healthData.lowDensityLipteinCholesterol>=1000){
						this.healthData.lowDensityLipteinCholesterol=''
						this.$toast('请输入正确的低密度脂蛋白胆固醇，列如：0.56')
						return
					}
					params.lowDensityLipteinCholesterol=this.healthData.lowDensityLipteinCholesterol
				}else {
					params.lowDensityLipteinCholesterol =0
				}
				if(this.healthData.heavySmoking!==undefined&&this.healthData.heavySmoking!==null&&this.healthData.heavySmoking!==''){
					params.heavySmoking = this.healthData.heavySmoking  //重度吸烟
				}
				// if(this.healthData.hereditaryDisease!==undefined&&this.healthData.hereditaryDisease!==null&&this.healthData.hereditaryDisease!==''){
				// 	params.hereditaryDisease = this.healthData.hereditaryDisease //心脑血管家族遗传病史
				// }
				console.log(params);
				if(this.healthData.sourceOfReferral===undefined){
					this.$toast('请选择转介来源')
					return
				}
				if(this.healthData.subordinateArea===undefined){
					this.$toast('请选择隶属区域')
					return
				}
				if(this.healthData.living===undefined){
					this.$toast('请选择居住方式')
					return
				}
				if(!this.healthData.name){
					this.$toast('请在个人中心完善姓名信息')
					return
				}
				if(this.healthData.gender===undefined){
					this.$toast('请选择性别')
					return
				}
				if(!this.healthData.birthday){
					this.$toast('请在个人中心完善出生年月')
					return
				}
				if(this.healthData.educationLevel===undefined){
					this.$toast('请选择文化程度')
					return
				}
				if(this.healthData.maritalStatus===undefined){
					this.$toast('请选择婚姻状况')
					return
				}
				if(this.healthData.medicalPaymentMethod===undefined){
					this.$toast('请选择医疗付款方式')
					return
				}
				if(!this.healthData.residenceAddress ){
					this.$toast('住所地址不能为空')
					return
				}
				if(this.healthData.takeAntihypertensiveDrugs===undefined){
					this.$toast('请选择是否正在服用降压药')
					return
				}
				if(this.healthData.diabetesMellitus===undefined){
					this.$toast('请选择是否糖尿病')
					return
				}
				if(this.healthData.littlePhysicalExercise===undefined){
					this.$toast('请选择体育锻炼情况')
					return
				}
				if(!this.healthData.height){
					this.$toast('身高不能为空')
					return
				}else if(this.healthData.height<0.5||this.healthData.height>3){
					this.$toast('请输入正确的身高（0.5~3）米')
					return
				}
				if(!this.healthData.weight ){
					this.$toast('体重不能为空')
					return
				}else if(this.healthData.weight<10||this.healthData.weight>300){
					this.$toast('请输入正确的体重（10~300）kg')
					return
				}
				if(this.healthData.smokingStatus===undefined){
					this.$toast('请选择吸烟情况')
					return
				}
				if(this.healthData.hereditaryDisease===undefined){
					this.$toast('请选择是否有心脑血管家族遗传病史')
					return
				}
				if(!(/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(this.healthData.name))){
					this.$toast('姓名不能包含特殊符号和空格')
					return
				}
				Indicator.open('保存中...')
				let res = await editHealthRecord(params)
				if(res.code === 200){
					Indicator.close()
					this.$toast('保存成功')
					setTimeout(()=>{
						this.$router.back()
					},100)
				}else if(res.code === 500){
					Indicator.close()
					this.$toast('服务器内部错误，请联系管理员')
				} else {
					Indicator.close()
					this.$toast(res.message)
				}
			},

			//新增健康档案
			async addHealthRecord(){
				let params = {
					// 必填项
					userId:this.userId,
					name :this.healthData.name,
					gender:this.healthData.gender,
					living:this.healthData.living,
					birthday:this.healthData.birthday,
					educationLevel:this.healthData.educationLevel ,
					residenceAddress:this.healthData.residenceAddress,
					// relation :this.healthData.relation,
					sourceOfReferral:this.healthData.sourceOfReferral,
					subordinateArea:this.healthData.subordinateArea,
					maritalStatus:this.healthData.maritalStatus,
					medicalPaymentMethod:this.healthData.medicalPaymentMethod,
					smokingStatus:this.healthData.smokingStatus,
					hereditaryDisease:this.healthData.hereditaryDisease,
					takeAntihypertensiveDrugs :this.healthData.takeAntihypertensiveDrugs,
					diabetesMellitus :this.healthData.diabetesMellitus,
					littlePhysicalExercise:this.healthData.littlePhysicalExercise,
					height:this.healthData.height,
					weight :this.healthData.weight,
				}

				// 非必填
				if(this.healthData.relation){
					params.relation = this.healthData.relation
				}
				if(this.healthData.residence){
					params.residence = this.healthData.residence.toString()
				}
				if(this.healthData.residenceContact){
					params.residenceContact = this.healthData.residenceContact
				}
				if(this.healthData.residenceContactPhone){
					params.residenceContactPhone = this.healthData.residenceContactPhone
				}
				if(this.healthData.workplace){
					params.workplace = this.healthData.workplace
				}
				if(this.healthData.workplaceContact){
					params.workplaceContact = this.healthData.workplaceContact
				}
				if(this.healthData.workplaceContactPhone){
					params.workplaceContactPhone = this.healthData.workplaceContactPhone
				}
				if(this.healthData.nativePlace){ //籍贯
					params.nativePlace = this.healthData.nativePlace
				}
				if(this.healthData.nationality){ //民族
					params.nationality = this.healthData.nationality
				}
				if(this.healthData.occupation){ //职业
					params.occupation = this.healthData.occupation
				}
				// 心脑血管疾病风险筛查：
				if(this.healthData.cerebralApoplexyFactor&&this.healthData.cerebralApoplexyFactor!==''){
					params.cerebralApoplexyFactor = this.healthData.cerebralApoplexyFactor.toString()
				}
				if(this.healthData.systolicBloodPressur){
					params.systolicBloodPressur = this.healthData.systolicBloodPressur
				}
				if(this.healthData.diastolicBloodPressur){
					params.diastolicBloodPressur=this.healthData.diastolicBloodPressur
				}
				if(this.healthData.systolicBloodPressur){
					params.systolicBloodPressur=this.healthData.systolicBloodPressur
				}
				if(this.healthData.triglyceride){
					if(this.healthData.triglyceride>=1000){
						this.$toast('请输入正确的甘油三酯含量，列如：1.56')
						return
					}
					params.triglyceride=this.healthData.triglyceride
				}
				if(this.healthData.highDensityLipteinCholesterol){
					if(this.healthData.highDensityLipteinCholesterol>=1000){
						this.$toast('请输入正确的高密度脂蛋白胆固醇，列如：1.56')
						return
					}
					params.highDensityLipteinCholesterol=this.healthData.highDensityLipteinCholesterol
				}
				if(this.healthData.lowDensityLipteinCholesterol){
					if(this.healthData.lowDensityLipteinCholesterol>=1000){
						this.$toast('请输入正确的低密度脂蛋白胆固醇，列如：0.56')
						return
					}
					params.lowDensityLipteinCholesterol=this.healthData.lowDensityLipteinCholesterol
				}
				if(this.healthData.heavySmoking!==undefined&&this.healthData.heavySmoking!==null&&this.healthData.heavySmoking!==''){
					params.heavySmoking = this.healthData.heavySmoking  //重度吸烟
				}
				// if(this.healthData.hereditaryDisease!==undefined&&this.healthData.hereditaryDisease!==null&&this.healthData.hereditaryDisease!==''){
				// 	params.hereditaryDisease = this.healthData.hereditaryDisease //心脑血管家族遗传病史
				// }
				if(this.healthData.sourceOfReferral===undefined){
					this.$toast('请选择转介来源')
					return
				}
				if(this.healthData.subordinateArea===undefined){
					this.$toast('请选择隶属区域')
					return
				}
				if(this.healthData.living===undefined){
					this.$toast('请选择居住方式')
					return
				}
				if(!this.healthData.name){
					this.$toast('请在个人中心完善姓名')
					return
				}
				if(this.healthData.gender===undefined){
					this.$toast('请选择性别')
					return
				}
				if(!this.healthData.birthday){
					this.$toast('请在个人中心完善出生日期')
					return
				}
				if(this.healthData.educationLevel===undefined){
					this.$toast('请选择文化程度')
					return
				}
				if(this.healthData.maritalStatus===undefined){
					this.$toast('请选择婚姻状况')
					return
				}
				if(this.healthData.medicalPaymentMethod===undefined){
					this.$toast('请选择医疗付款方式')
					return
				}
				if(!this.healthData.residenceAddress){
					this.$toast('住所地址不能为空')
					return
				}
				if(this.healthData.takeAntihypertensiveDrugs===undefined){
					this.$toast('请选择是否正在服用降压药')
					return
				}
				if(this.healthData.diabetesMellitus===undefined){
					this.$toast('请选择是否糖尿病')
					return
				}
				if(this.healthData.littlePhysicalExercise===undefined){
					this.$toast('请选择体育锻炼情况')
					return
				}
				if(!this.healthData.height){
					this.$toast('身高不能为空')
					return
				}else if(this.healthData.height<0.5||this.healthData.height>3){
					this.$toast('请输入正确的身高（0.5~3）米')
					return
				}
				if(!this.healthData.weight ){
					this.$toast('体重不能为空')
					return
				}else if(this.healthData.weight<10||this.healthData.weight>300){
					this.$toast('请输入正确的体重（10~300）kg')
					return
				}
				if(this.healthData.smokingStatus===undefined){
					this.$toast('请选择吸烟情况')
					return
				}
				if(this.healthData.hereditaryDisease===undefined){
					this.$toast('请选择是否有心脑血管家族遗传病史')
					return
				}
				if(!(/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(this.healthData.name))){
					this.$toast('姓名不能包含特殊符号和空格')
					return
				}
				console.log(params);
				Indicator.open('添加中...')
				let res =await addHealthRecord(params)
				if(res.code === 200){
					Indicator.close()
					this.$toast('添加健康档案成功')
					setTimeout(()=>{
						this.$router.push({name:'首页'})
					},300)
				}else if(res.code === 500){
					Indicator.close()
					this.$toast('服务器内部错误，请联系管理员')
				} else {
					Indicator.close()
					this.$toast(res.message)
				}
			},
			// 民族
			async getNation(){
				let res = await getNation({
					page:0,
					size:60
				})
				if(res.code === 200){
					this.nationality=res.data.list
				}
			},
			// 隶属区域
			async getDistrict(){
				let res =await getDistrict({
					page:0,
					size:13
				})
				if(res.code === 200){
					this.suboAreaList=res.data.list
				}
			},
			// 籍贯
			async getProvince(){
				let res =await getProvince({
					page:0,
					size:50
				})
				if(res.code === 200){
					this.nativePlace=res.data.list
				}
			},
			// 转介来源
			async getSourceList(){
				let res =await getSourceList({size:10})
				if(res.code === 200){
					this.sourceList = res.data.list
				}
			},
			// 医疗付款方式
			async getPayList(){
				let res =await getPayList()
				if(res.code === 200){
					this.payList = res.data.list
				}
			},
			// 现居住地列表
			async getResidenceList(){
				let res =await getResidenceList()
				if(res.code === 200){
					this.resiList = res.data.list
				}
			},
			goBack(){
				MessageBox.confirm('是否放弃修改？').then(action => {
					if(action==='confirm'){
						this.$router.back();//返回上一层
					}
				}).catch(() => {
					console.log('取消');
				})

			},
			showPopFn() {
				this.show = true;
				console.log(this.currentDate);
				this.currentDate = 	this.healthData.birthday?new Date(this.healthData.birthday.replace(/-/g,",")):new Date(1950,0,1)
			},
			confirmFn() { // 确定按钮
				setTimeout(()=>{
					console.log(this.formatDate(this.currentDate))
					this.healthData.birthday = this.formatDate(this.currentDate)
					this.show = false
					this.getAge()
				},100)
			},
			cancelFn(){
				this.show = false;
			},
			// 格式化时间
			formatter(type, value) {
				if (type === 'year') {
					return `${value}年`;
				} else if (type === 'month') {
					return `${value}月`
				}else if (type === 'day') {
					return `${value}日`
				}else if (type === 'hour') {
					return `${value}时`
				}else if (type === 'minute') {
					return `${value}分`
				}
				return value;
			},
			// 格式化获取的时间
			formatDate(date) {
				const y = date.getFullYear()
				let M = date.getMonth() + 1
				M = M < 10 ? '0' + M : M
				let d = date.getDate()
				d = d < 10 ? ('0' + d) : d
				let h = date.getHours()
				h = h < 10 ? ('0' + h) : h
				let m = date.getMinutes()
				m = m < 10 ? ('0' + m) : m
				this.birthYear = y
				this.birthMonth = M
				this.birthDay = d
				return y + '-' + M + '-' + d
			},
			//获取当前时间
			getDay(num, str) {
				let today = new Date();
				let nowTime = today.getTime();
				let ms = 24*3600*1000*num;
				today.setTime(parseInt(nowTime + ms));
				let oYear = today.getFullYear();
				let oMoth = (today.getMonth() + 1).toString();
				if (oMoth.length <= 1) oMoth = '0' + oMoth;
				let oDay = today.getDate().toString();
				if (oDay.length <= 1) oDay = '0' + oDay;
				this.currDate = oYear + str + oMoth + str + oDay
				console.log(this.currDate);
				// return oYear + str + oMoth + str + oDay;
			},
			// 判断用户的年龄
			getAge(){
				if(this.healthData.birthday){
					let birthdays = new Date(this.healthData.birthday.replace(/-/g, "/"));
					let d = new Date()
					let age = d.getFullYear() - birthdays.getFullYear() - (d.getMonth() < birthdays.getMonth() || (d.getMonth() == birthdays.getMonth() && d.getDate() < birthdays.getDate()) ? 1 : 0)
					this.healthData.age = age
				}
				console.log(this.healthData.age);
			},
			//获取个人信息
			async getUserDate(params){
				let res = await getUserDate(params)
				if(res.code === 200){
					this.healthData.name = res.data.name?res.data.name:''
					this.healthData.gender = res.data.gender
					// if(res.data.birthYear){
					// 	let birthYear = res.data.birthYear
					// 	let birthMonth =  res.data.birthMonth
					// 	let birthDay =  res.data.birthDay
					// 	this.healthData.birthday = 	birthYear+'-'+birthMonth+'-'+birthDay
					// }else {
					// 	this.healthData.birthday = null
					// }
					if(!this.healthData.residenceContactPhone||this.healthData.residenceContactPhone==='null'){
						this.healthData.residenceContactPhone = res.data.username
					}
				}
			},

			validateNum(type){
				console.log(type);
				let height = this.healthData.height
				let weight = this.healthData.weight
				if(type==='身高'){
					if(height<0.5||height>3){
						this.healthData.height = ''
						this.$toast('请输入正确的身高（0.5~3）米')
					}
				}else if(type==='体重'){
					if(weight<10||weight>300){
						this.healthData.weight = ''
						this.$toast('请输入正确的体重（10~300）kg')
					}
				}
			}
		}
	}
</script>

<style scoped>
	.content-card >>>.ivu-form-item{
		display: flex;
		margin-bottom: 25px;
	}
	.content-card >>>.ivu-form-item .ivu-form-item-label{
		font-size:32px;
		font-family:PingFangSC;
		font-weight:400;
		color:rgba(68,68,68,1);
	}
	.content-card >>>.ivu-select-selected-value{
		font-size:24px;
		font-family:PingFangSC;
		font-weight:400;
		color:rgba(102,102,102,1);
	}
	.content-card >>>.ivu-form-item-content{
		/*width:400px;*/
		width: 60%;
	}
	.head-bar >>> .ivu-icon{
		font-size: 58px;
		position: absolute;
		left: 10px;
	}
	.body-two >>> .ivu-checkbox{
		border-radius: 50%;
		overflow: hidden;
		background:rgba(235,235,235,1);
		width:32px;
		height:32px;
	}
	.body-two >>> .ivu-checkbox-checked{
		background:rgba(71,189,195,1);
	}
	.body-two >>> .ivu-checkbox-inner{
		border: 0;
		background: transparent;
		width:32px;
		height:32px;
	}
	.body-two >>> .ivu-checkbox-inner:after{
		position: relative;
		top: 6px;
		left: 12px;
	}
	.body-two >>>.ivu-form-item{
		text-align: left;
		padding-top: 40px;
		border-top:2px solid #DEDEDE;
	}
	.body-two >>>.ivu-form-item:first-child{
		border-top:none;
	}
	.main>>>.ivu-form-item-error-tip{
		padding-top: 0px;
	}
	.hg>>>.ivu-form-item-label{
		font-size:28px;
		font-family:PingFangSC;
		font-weight:400;
		color:rgba(68,68,68,1);
		padding: 0;
		display: flex;
		align-items: center;
		padding-right: 10px;
	}
	.ivu-checkbox-wrapper{
		font-size:28px;
		font-family:PingFangSC;
		font-weight:400;
		color:rgba(102,102,102,1);
	}
	.main>>>.ivu-input{
		font-size:24px;
		font-family:PingFangSC;
		font-weight:400;
		/*color:rgba(102,102,102,1);*/
	}
	.main .body-two .mmHg >>>.ivu-form-item-label{
		font-size:24px;
		font-family:PingFangSC;
		font-weight:400;
		color:rgba(153,153,153,1);
		padding-right: 5px;
	}
	.main .body-two >>>.ivu-radio-wrapper{
		font-size:28px;
		font-family:PingFangSC;
		font-weight:400;
		color:rgba(102,102,102,1);
		margin-right: 20px;
	}
	.sc>>>.ivu-form-item-label{
		font-size:24px;
		font-family:PingFangSC;
		font-weight:400;
		color:rgba(153,153,153,1);
	}
	.ng-box>>>.ivu-form-item-label{

	}
	.ng-box>>>.ivu-form-item-content{
		/*width: 200px;*/
		/*width: 50%;*/
	}
	.diabetesMellitus>>>.ivu-radio-wrapper{
		margin-left: 20px;
		font-size:28px;
		font-family:PingFangSC;
		font-weight:400;
		color:rgba(102,102,102,1);
	}
	.body-two>>>.ivu-form-item-content{
	}
	.main>>>.ivu-input[disabled] {
		/*background-color: #ffffff;*/
	}
	.birthday>>> .ivu-input[disabled]{
		background-color: #ffffff;
		color: rgba(102,102,102,1);
	}

</style>

<style lang="less" scoped>
	.main {
		padding-top: 90px;
		padding-bottom: 80px;
		/*background-color: #fff;*/
		background-color: #F7F7F7;
		min-height: 100%;
		.head-bar{
			width: 100%;
			height:90px;
			line-height:90px;
			background:rgba(245,245,245,1);
			position: fixed;
			top: 0;
			left: 0;
			display: flex;
			align-items: center;
			font-size:28px;
			z-index: 50;
			padding: 0 70px;
			font-family:PingFangSC;
			font-weight:400;
			color:rgba(51,51,51,1);
			span{
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0 20px;
				i{
					display: flex;
					height: 100%;
					align-items: center;
				}
			}
		}
		h1{
			height:56px;
			font-size:40px;
			font-family:PingFangSC;
			font-weight:500;
			color:rgba(51,51,51,1);
			line-height:56px;
			text-align: left;
			background-color: #F7F7F7;
			padding:30px 32px 90px;
			span{
				font-size:28px;
				font-family:PingFangSC;
				font-weight:400;
				color:rgba(102,102,102,1);
				display: inline-block;
				margin-left: 15px;
			}
		}
		h2{
			height:56px;
			font-size:40px;
			font-family:PingFangSC;
			font-weight:500;
			color:rgba(51,51,51,1);
			line-height:56px;
			text-align: left;
		}
		.content{
			background-color: #fff;
			/*padding: 0 32px;*/
			margin-bottom: 20px;
			.content-card{
				width: 100%;
				padding: 21px 0;
				border-bottom: 2px solid #DEDEDE;
				.birthday-box{
					display: flex;
					justify-content: space-between;
					.birthday{
						/*width:224px;*/
						width: 50%;
					}
					span{
						font-size:30px;
						font-family:PingFangSC;
						font-weight:400;
						color:rgba(68,68,68,1);
					}
				}
			}
		}
		.line{
			height: 22px;
			background-color: #F7F7F7;
		}
		.btn{
			/*width:690px;*/
			width: 90%;
			height:80px;
			line-height: 80px;
			background:rgba(71,189,195,1);
			border-radius:10px;
			font-size:30px;
			font-family:PingFangSC;
			font-weight:600;
			color:rgba(255,255,255,1);
			margin: 70px auto 0;
		}
		.body-one{
			padding:20px 32px 2px;
		}
		.body-two{
			background:rgba(255,255,255,1);
			border-radius:10px;
			transition: all .3s;
			padding:40px 32px 5px;
			h2{
				font-size:40px;
				font-family:PingFangSC;
				font-weight:400;
				color:rgba(51,51,51,1);
				line-height:56px;
				span{
					font-size:28px;
					font-family:PingFangSC;
					font-weight:400;
					color:rgba(153,153,153,1);
				}
			}
			h4{
				font-size:30px;
				font-family:PingFangSC;
				font-weight:400;
				color:rgba(68,68,68,1);
			}
			.tip{
				width:44px;
				height:44px;
				line-height: 40px;
				background:rgba(255,255,255,1);
				border-radius:4px;
				border:2px solid rgba(102,102,102,1);
				display: inline-block;
				text-align: center;
				margin-right: 20px;
			}
			.xuezhi{
				.ivu-form-item{
					border-top: none;
				}
			}
			.hg{
				display:flex;
				align-items: center;
				border-top:1px solid #DEDEDE;
			}
			.mmHg{
				text-align: left;
				border-top:1px solid #DEDEDE;
				padding-top: 0.53rem
			}
			.explain{
				font-size:24px;
				font-family:PingFangSC;
				font-weight:400;
				color:rgba(153,153,153,1);
			}
			.cerebralApoplexyFactor{
				margin-top: 20px;
				span{
					margin-right: 30px;
				}
			}
		}
	}
</style>
