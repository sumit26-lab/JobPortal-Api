const router=require('express').Router()
const Skill_controler= require('../../controler/Jobseeker/jobSkillControler')
router.post('/',Skill_controler.createSkill)
router.get('/',Skill_controler.getAll_skill)
router.get('/:id',Skill_controler.getIdBySkill)
router.put('/:id',Skill_controler.update)
router.delete('/:id',Skill_controler.deleteSkill)
module.exports=router